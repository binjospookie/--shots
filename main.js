/* eslint-disable */
const fs = require('fs');
const electron = require('electron');
const app = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;
const {
    ipcMain
} = require('electron');
const ipc = require('electron').ipcMain;
ipc.on('errorInWindow', function(event, error, url, line){
    console.log(url, line, error);
});
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
let globalShot;
/**
 * Окно приложения
 */
let appWindow;
const argv = require('minimist')(process.argv);
let gettedDbToken;
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
    tray = new Tray(__dirname + '/icon.png');
    createWindow();

    rigesterGlobalHotkey();

    const template = appMenu(app, appWindow, getDropboxToken);
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
  if (process.platform !== 'darwin') {
    app.quit();
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
    } else if (arg === 'version') {
        event.returnValue = app.getVersion();
    } else if (arg === 'dropbox-token') {
      validateDropboxToken(data);
      event.returnValue = 'ty';
    }  else if (arg === 'createNew') {
        if (data === 'ask') {
          dialog.showMessageBox(newShotDialog, function(index) {
              // если пользователь подтвердил выбор — далем новый скриншот
              if (index === 0) {
                appWindow.webContents.send('new');
              }
              event.returnValue = 'not-ok';
          })
        } else {
          appWindow.webContents.send('new');
          event.returnValue = 'ok';
        }
    //    event.returnValue = app.getVersion();
    } else{
        appWindow.show();
        appWindow.setPosition(0,0);
        const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
        appWindow.setSize(width, height);
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

ipc.on('open-save-dialog',  function(event, data, path) {
  let saveDialogOption = {
    filters: [{name: 'Images', extensions: ['png']}]
  }

  if (path !== null) {
    saveDialogOption.defaultPath = path;
  }

  dialog.showSaveDialog(saveDialogOption, function(path) {
      if (path !== undefined) {
        fs.writeFile(path, data);
        appWindow.webContents.send( 'successSave', path );
      } else {
        appWindow.webContents.send( 'canceledSave');
      }
  });
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

    if (argv.debug) {
        appWindow.webContents.openDevTools();
    }

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

    let processStartFlags = Object.keys(argv)[1];
    if ((processStartFlags) && (processStartFlags !== 'debug')) {
      parseAndDo(`-${processStartFlags}`);
      if (['h','help','a','about','v','version'].indexOf(processStartFlags) !== -1) {
        app.exit(0);
      }
    }
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
            app.createShot = true;
            appWindow.webContents.send('saveState');
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
        label: 'Disable shortcuts',
        type: 'checkbox',
        click(element) {
          if (element.checked === true) {
            globalShortcut.unregisterAll();
          } else {
            rigesterGlobalHotkey();
          }
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
    case '-help':
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
        shots -v  -->  shots ${app.getVersion()}
`);
      break;
    case '--version':
    case '-version':
    case  '-v':
      console.log(`--shots ${app.getVersion()}`);
      break;
    case '--about':
    case '-about':
    case '-a':
      console.log('--shots is an application for creating screenshots.\n' +
        'It was created on web-technologies.\nhttps://github.com/binjospookie/--shots');
      break;
    case '--capture':
    case '-capture':
    case  '-c':
    dialog.showMessageBox(newShotDialog, function(index) {
        // если пользователь подтвердил выбор — далем новый скриншот
        if (index === 0) {
          app.createShot = true;
          appWindow.webContents.send('new', 'capture');
          appWindow.setPosition(0,0);
          appWindow.show();
          appFirstStart = false;
        }
    })
      break;
    case '--fast':
    case '-fast':
    case '-f':
    dialog.showMessageBox(newShotDialog, function(index) {
        // если пользователь подтвердил выбор — далем новый скриншот
        if (index === 0) {
            app.createShot = true;
            appWindow.webContents.send('new', 'fast');
            appWindow.setPosition(0,0);
            appWindow.show();
            appFirstStart = false;
        }
    })
      break;
    case '--new':
    case '-new':
    case '-n':
    app.createShot = true;
    appWindow.webContents.send('saveState');
      break;
    case '--save':
    case '-save':
    case '-s':
      if (appFirstStart === true) {
        console.log(`Screenshot wasn't create. Try 'shots --new'`);
        app.exit(0);
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

function rigesterGlobalHotkey() {
  globalShot = globalShortcut.register('CommandOrControl+Alt+M', () => {
    if (appFirstStart) {
      app.createShot = true;
      appWindow.webContents.send('new');
      appWindow.setPosition(0,0);
      appWindow.show();
      appWindow.focus();
      appFirstStart = false;
      return;
    }

    app.createShot = true;
    appWindow.webContents.send('saveState');
  })
}

// dropbox get token
function getDropboxToken() {
  appWindow.webContents.send('isDropbox');
}

function validateDropboxToken(data) {
    // need auth
      let dbWindow = new BrowserWindow({
          width: 500,
          height: 500,
          icon: __dirname + '/icon.png'
      });
      
      dbWindow.loadURL('https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=<--shots-token>&redirect_uri=https://theshots.ru')
      
      dbWindow.on('focus', function(){
        Menu.setApplicationMenu(null);
      })
      
      dbWindow.on('blur', function(){
        Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(app, appWindow, getDropboxToken)));
      })
      
      dbWindow.on('close', function(event) {
        dbHistory = dbWindow.webContents.history;
        gettedDbToken = dbHistory[dbHistory.length - 1];
        appWindow.webContents.send('freshDropboxToken', gettedDbToken);
      });
      dbWindow.on('closed', ()=>{
        Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(app, appWindow, getDropboxToken)));
        dbWindow = null;
      });
}