import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import fs from 'fs';
import { store } from './store';
import { getAssetPath, renderString } from './util';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  getThemeFolders(): string[] {
    const themesPath = getAssetPath('themes');
    try {
      return fs
        .readdirSync(themesPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    } catch (error) {
      console.error('Error reading themes directory:', error);
      return [];
    }
  }

  buildThemeSubmenu(): MenuItemConstructorOptions {
    const themes = this.getThemeFolders();
    const currentTheme = store.get('theme', 'frog');
    return {
      label: 'Theme',
      submenu: themes.map((theme) => ({
        label: renderString(theme),
        type: 'radio',
        checked: theme === currentTheme,
        click: () => {
          store.set('theme', theme);
        },
      })),
    };
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Juke',
      submenu: [
        {
          label: 'Hide Juke',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };

    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };

    const subMenuTheme = this.buildThemeSubmenu();

    return [subMenuAbout, subMenuTheme, subMenuWindow];
  }

  buildDefaultTemplate() {
    const templateDefault = [this.buildThemeSubmenu()];

    return templateDefault;
  }
}
