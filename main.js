/* eslint-disable */

const electron = require('electron');
const app = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;
const {
    ipcMain
} = require('electron');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const {
    Menu
} = require('electron');
const appMenu = require('./scripts/appMenu');
const {
    clipboard,
    Tray
} = require('electron');
let tray = null;
/**
 * Окно приложения
 */
let appWindow;

/**
 * Опции диалога о новом скриншоте
 * @type {{type: string, title: string, message: string, buttons: string[]}}
 */
const newShotDialog = {
    type: 'info',
    title: 'Create new shot',
    message: 'All your progress will be lost. Are you sure?',
    buttons: ['Yes', 'No']
};

const signInDialog = {
    type: 'info',
    title: 'Sign out',
    message: `You're authorized user. Would you want to sign out?`,
    buttons: ['Yes', 'No']
};

const shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window
  if (appWindow) {
    if (appWindow.isMinimized()) appWindow.restore();
    appWindow.focus();
  }
  return true;
});

if (shouldQuit) {
  app.quit();
  return;
}

/**
 * Создаём окно, когда приложение инициализировано
 * И регистрируем необходимые клаиши для обработки истории
 */
app.on('ready', () => {
    createWindow();

    const template = appMenu(app, appWindow);
    const menu = Menu.buildFromTemplate(template);

    /**
     * Содаём меню приложения
     */
    Menu.setApplicationMenu(menu);

    // регистрируем esc
    const Esc = globalShortcut.register('Esc', () => {
        appWindow.webContents.send('stop');
    });

    tray = new Tray(__dirname + '/icon.png');
    app.firstStartTray = true;
    appWindow.hide();

    tray.setToolTip('--shots');
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

/**
 * Уничтожаем процесс, когда все окна закрыты
 */
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

/**
 * Принимаем сообщения из рендера и отвечаем на них
 */
ipcMain.on('synchronous-message', (event, arg, data) => {
    if (arg === 'hide') {
        event.returnValue = 'ok';
        appWindow.hide();
    } else if (arg === 'crop') {
        event.returnValue = 'ok';
    } else if (arg === 'rect') {
        event.returnValue = 'ok';
    } else if (arg === 'pen') {
        event.returnValue = 'ok';
    } else if (arg === 'arrow') {
        event.returnValue = 'ok';
    } else if (arg === 'optimize') {
        let oImg = optimizeShots(data);
        event.returnValue = 'data';
    } else {
        appWindow.show();
        appWindow.setPosition(0,0);
        appWindow.setSize(arg.width, arg.height);
    }
});

/**
 * Выводим диалог перед новым скриншотом
 */
ipc.on('open-information-dialog', function() {
    dialog.showMessageBox(newShotDialog, function(index) {
        // если пользователь подтвердил выбор — далем новый скриншот
        if (index === 0) {
          appWindow.webContents.send( 'new' );
        }
    })
});

/**
 * Выводим диалог перед деавторизацией
 */
ipc.on('open-signin-dialog', function() {
    dialog.showMessageBox(signInDialog, function(index) {
        // если пользователь подтвердил выбор — далем новый скриншот
        if (index === 0) {
          appWindow.webContents.send( 'signout' );
        }
    })
});

/**
 * Метод создания окна приложения
 */
function createWindow() {
    appWindow = new BrowserWindow({
        width: 0,
        height: 0,
        icon: __dirname + '/icon.png'
    });
    appWindow.loadURL(`file://${__dirname}/index.html`);
   // appWindow.webContents.openDevTools();
    appWindow.on('closed', function() {
        appWindow = null;
    });

    appWindow.on('minimize', function() {
      let contextMenu = createContextMenu(false, true, false);

      tray.setContextMenu(contextMenu);
    });

    appWindow.on('hide', function() {
      if (app.firstStartTray === true) {
        let contextMenu = createContextMenu(true, false, false);
        tray.setContextMenu(contextMenu);
        app.firstStartTray = false;
      } else {
        let contextMenu = createContextMenu(true, true, false);
        tray.setContextMenu(contextMenu);
      }
    });

    appWindow.on('show', function() {
      let contextMenu = createContextMenu(true, false, true);

      tray.setContextMenu(contextMenu);
      if(app.createShot  === true) {
        appWindow.webContents.send( 'new' );
        app.createShot = false;
      }
    });

    appWindow.setAutoHideMenuBar(false);
}

function createContextMenu(newShot, open, tray) {
    return (
      Menu.buildFromTemplate([{
          label: 'New',
          enabled: newShot,
          click() {
            dialog.showMessageBox(newShotDialog, function(index) {
                // если пользователь подтвердил выбор — далем новый скриншот
                if (index === 0) {
                    app.createShot = true;
                    appWindow.setPosition(0,0);
                    appWindow.show();
                }
            })
          }
      },
      {
        label: 'Open',
        enabled: open,
        click() {
            appWindow.show();
            appWindow.setPosition(0,0);
        }
      },
      {
        label: 'Minimize to tray',
        enabled: tray,
        click() {
              appWindow.hide();
        }
      },
      {
          label: 'Quit',
          click() {
              globalShortcut.unregisterAll();
              if (process.platform !== 'darwin') {
                  app.quit()
              }
          }
      }])
    );
}

function optimizeShots(data) {
    //	console.log('ready')
}
