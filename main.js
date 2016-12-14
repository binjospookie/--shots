/* eslint-disable */

const APP_VERSION = 'v1.0.3';
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

let appFirstStart = true;

const shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // apply params from console
  if (commandLine[1]) {
    parseAndDo(commandLine[1]);
    return true;
  }

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
    // get start' params from console
    console.log(process.arg);
    tray = new Tray(__dirname + '/icon.png');
    createWindow();

    const template = appMenu(app, appWindow);
    const menu = Menu.buildFromTemplate(template);

    /**
     * Содаём меню приложения
     */
    Menu.setApplicationMenu(menu);

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
    app.quit()
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
    if (process.platform === 'darwin') {
      appWindow.loadURL(`file://${__dirname}/index.mac.html`);
    } else {
      appWindow.loadURL(`file://${__dirname}/index.html`);
    }
    appWindow.webContents.openDevTools();
    appWindow.on('closed', function() {
        appWindow = null;
    });

    let contextMenu = createContextMenu(true, false, false);
    tray.setContextMenu(contextMenu);

    app.firstStartTray = false;
    appWindow.on('minimize', function() {
      contextMenu = createContextMenu(false, true, false);

      tray.setContextMenu(contextMenu);
    });

    appWindow.on('hide', function() {
      if (app.firstStartTray === true) {
        contextMenu = createContextMenu(true, false, false);
        tray.setContextMenu(contextMenu);
        app.firstStartTray = false;
      } else {
        contextMenu = createContextMenu(true, true, false);
        tray.setContextMenu(contextMenu);
      }
    });

    appWindow.on('show', function() {
      contextMenu = createContextMenu(true, false, true);

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
            if (appFirstStart) {
              app.createShot = true;
              appWindow.webContents.send('new');
              appWindow.setPosition(0,0);
              appWindow.show();
              appFirstStart = false;
              return;
            }

            dialog.showMessageBox(newShotDialog, function(index) {
                // если пользователь подтвердил выбор — далем новый скриншот
                if (index === 0) {
                    app.createShot = true;
                    appWindow.webContents.send('new');
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

              app.quit()
          }
      }])
    );
}

function parseAndDo(flagName) {
  switch (flagName) {
    case '--help':
    case '-h':
console.log(
`Usage:
        shots [option]

Options:
        -v, --version    | print --shots version
        -h, --help       | show all commands
        -a, --about      | about --shots
        -n, --new        | create screenshot
        -c, --capture    | capture screenshot and call crop tool
        -f, --fast       | capture screenshot and save
        -s, --save       | save current screenshot

Example:
        shots -v  -->  shots ${APP_VERSION}
`);
      break;
    case '--version':
    case  '-v':
      console.log(`--shots ${APP_VERSION}`);
      break;
    case '--about':
    case  '-a':
      console.log('--shots is an application for creating screenshots.\n' +
        'It was created on web-technologies.\nhttps://github.com/binjospookie/--shots');
      break;
    case '--capture':
    case  '-c':
      app.createShot = true;
      appWindow.webContents.send('new', 'capture');
      appWindow.setPosition(0,0);
      appWindow.show();
      appFirstStart = false;
      break;
    case '--fast':
    case  '-f':
      app.createShot = true;
      appWindow.webContents.send('new', 'fast');
      appWindow.setPosition(0,0);
      appWindow.show();
      appFirstStart = false;
      break;     
    case '--new':
    case  '-n':
      app.createShot = true;
      appWindow.webContents.send('new');
      appWindow.setPosition(0,0);
      appWindow.show();
      appFirstStart = false;
      break;
    case '--save':
    case  '-s':
      if (appFirstStart === true) {
        console.log(`Screenshot wasn't create. Try 'shots --new'`);
        break;
      }
      appWindow.webContents.send( 'save' );
      break;  
    default:
      console.log('Unknown option. Try "shots --help"');
      break;
  }
}

function optimizeShots(data) {
    //	console.log('ready')
}
