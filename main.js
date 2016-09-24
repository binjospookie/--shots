const electron = require( 'electron' );
const app = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require( 'electron' );
const ipc = require( 'electron' ).ipcMain;
const dialog = require( 'electron' ).dialog;
const {Menu} = require('electron');
const appMenu = require('./scripts/appMenu');
const {clipboard, Tray} = require('electron');

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
	buttons: [ 'Yes', 'No' ]
};

/**
 * Создаём окно, когда приложение инициализировано
 * И регистрируем необходимые клаиши для обработки истории
 */
app.on( 'ready', ()=>{
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
} );

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

/**
 * Уничтожаем процесс, когда все окна закрыты
 */
app.on( 'window-all-closed', function() {
	if ( process.platform !== 'darwin' ) {
		app.quit()
	}
} );

/**
 * Принимаем сообщения из рендера и отвечаем на них
 */
ipcMain.on( 'synchronous-message', ( event, arg ) => {
	if ( arg === 'hide' ) {
		event.returnValue = 'ok';
		appWindow.hide();
	} else if (arg === 'crop'){
		event.returnValue = 'ok';
	} else if (arg === 'rect'){
		event.returnValue = 'ok';
	} else if (arg === 'pen'){
		event.returnValue = 'ok';
	} else {
		appWindow.show();
		appWindow.setSize( arg.width, arg.height );
	}
} );

/**
 * Выводим диалог перед новым скриншотом
 */
ipc.on( 'open-information-dialog', function() {
	dialog.showMessageBox( newShotDialog, function( index ) {
		// если пользователь подтвердил выбор — далем новый скриншот
		if ( index === 0 ) {
			app.relaunch();
			app.exit(0);
		}
	} )
} );


/**
 * Метод создания окна приложения
 */
function createWindow() {
	appWindow = new BrowserWindow( { width: 0, height: 0, icon: __dirname + '/icon.png' });
	appWindow.loadURL( `file://${__dirname}/index.html` );
	appWindow.webContents.openDevTools();
	appWindow.on( 'closed', function() {
		appWindow = null
	} );
	appWindow.setAutoHideMenuBar(false);
}
