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

export default class ThemeParser {
  themePath: string;

  config: Partial<Config>;

  images: Record<string, Image>;

  font: ArrayBuffer | null;

  constructor(themePath: string) {
    this.themePath = getAssetPath('themes', themePath);
    this.config = {};
    this.images = {};
    this.font = null;
  }

  async parse() {
    await this.parseConfig();
    await this.parseImages();
    await this.parseFont();
    return {
      config: this.config,
      images: this.images,
      font: this.font,
    } as Theme;
  }

  async parseConfig() {
    const configPath = path.join(this.themePath, 'config.json');
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(configData);
    } catch (error) {
      console.error('Error parsing config.json:', error);
      throw error;
    }
  }

  async parseImages() {
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

    imageFiles.forEach(async (file: string) => {
      const imagePath = await this.findImage(file);
      if (imagePath) {
        const buffer = await fs.readFile(imagePath);
        const size = sizeOf(buffer);
        const extension = imagePath.split('.').pop() || '';
        const blob = new Blob([buffer], { type: `image/${extension}` });
        const result = await blob.arrayBuffer();
        const arrayBuffer = new Uint8Array(result);
        this.images[file] = {
          data: arrayBuffer,
          extension,
          width: size.width || 0,
          height: size.height || 0,
        };
      }
    });
  }

  async findImage(baseName: string) {
    const extensions = ['png', 'jpg', 'gif'];
    const files = await Promise.all(
      extensions.map(async (ext) => {
        const filePath = path.join(this.themePath, `${baseName}.${ext}`);
        try {
          await fs.access(filePath);
          return filePath;
        } catch (error) {
          // File doesn't exist, try next extension
        }

        return null;
      }),
    );
    return (files.filter((e) => e)[0] as string) || null;
  }

  async parseFont() {
    const fontPath = path.join(this.themePath, 'font.ttf');
    try {
      await fs.access(fontPath);
      if (fontPath) {
        const buffer = await fs.readFile(fontPath);
        const blob = new Blob([buffer], { type: 'font/ttf' });
        const result = await blob.arrayBuffer();
        const arrayBuffer = new Uint8Array(result);
        this.font = arrayBuffer;
      }
    } catch (error) {
      // Font file doesn't exist
    }
  }
}

module.exports = ThemeParser;
