import { BrowserWindow } from 'electron';
import fs from 'fs/promises';
import sizeOf from 'image-size';
import path from 'path';
import { Config } from './types';
import { getAssetPath } from './util';

export type Image = {
  data: ArrayBuffer;
  extension: string;
  width: number;
  height: number;
};

export type Theme = {
  config: Config;
  images: Record<string, Image>;
  font?: ArrayBuffer;
};

let themePath = '';

async function findImage(baseName: string): Promise<string | null> {
  const extensions = ['png', 'jpg', 'gif'];
  const files = await Promise.all(
    extensions.map(async (ext) => {
      const filePath = path.join(themePath, `${baseName}.${ext}`);
      try {
        await fs.access(filePath);
        return filePath;
      } catch (error) {
        // File doesn't exist, try next extension
      }
      return null;
    }),
  );
  return files.filter((e) => e)[0] || null;
}
export async function parseConfig(): Promise<Config> {
  const configPath = path.join(themePath, 'config.json');
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData) as Config;
    return config;
  } catch (error) {
    console.error('Error parsing config.json:', error);
    throw error;
  }
}

export async function parseImages(): Promise<Record<string, Image>> {
  const images: Record<string, Image> = {};
  const imageFiles = [
    'background',
    'close',
    'minimize',
    'play',
    'pause',
    'previous',
    'next',
    'closePressed',
    'minimizePressed',
    'playPressed',
    'pausePressed',
    'previousPressed',
    'nextPressed',
  ];

  await Promise.all(
    imageFiles.map(async (file) => {
      const imagePath = await findImage(file);
      if (imagePath) {
        const buffer = await fs.readFile(imagePath);
        const size = sizeOf(buffer);
        const extension = imagePath.split('.').pop() || '';
        const blob = new Blob([buffer], { type: `image/${extension}` });
        const result = await blob.arrayBuffer();
        const arrayBuffer = new Uint8Array(result);
        images[file] = {
          data: arrayBuffer,
          extension,
          width: size.width || 0,
          height: size.height || 0,
        };
      }
    }),
  );
  return images;
}

export async function parseFont(): Promise<ArrayBuffer | null> {
  let font: ArrayBuffer | null = null;
  const fontPath = path.join(themePath, 'font.ttf');
  try {
    await fs.access(fontPath);
    if (fontPath) {
      const buffer = await fs.readFile(fontPath);
      const blob = new Blob([buffer], { type: 'font/ttf' });
      const result = await blob.arrayBuffer();
      font = result;
    }
  } catch (error) {
    // Font file doesn't exist
  }
  return font;
}

export async function parseTheme(theme: string): Promise<Theme> {
  themePath = getAssetPath('themes', theme);
  const config = await parseConfig();
  const images = await parseImages();
  const font = await parseFont();
  return {
    config: config as Config,
    images,
    font: font as ArrayBuffer,
  };
}

export const setTheme = async (theme: string, window: BrowserWindow) => {
  const themeData = await parseTheme(theme);
  window.webContents.send('theme-update', themeData);
  if (themeData?.images?.background) {
    window?.setSize(
      themeData.images.background.width,
      themeData.images.background.height,
    );
  }
};
