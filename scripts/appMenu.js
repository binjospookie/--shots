const {shell} = require('electron');

module.exports = function appMenu(app, appWindow) {
    return (
        [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New',
                        accelerator: 'CmdOrCtrl+N',
                        click () { appWindow.webContents.send('new'); }
                    },
                    {
                        label: 'Save',
                        accelerator: 'CmdOrCtrl+S',
                        click () {appWindow.webContents.send('save');}
                    },
                    {
                        label: 'Restart',
                        accelerator: 'CmdOrCtrl+R',
                        click () {
                            app.relaunch();
                            app.exit(0);
                        }
                    },
                    {
                        label: 'Quit',
                        accelerator: 'CmdOrCtrl+Q',
                        click () { app.quit() }
                    },
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Undo',
                        accelerator: 'CmdOrCtrl+Z',
                        click () { appWindow.webContents.send('undo'); }
                    },
                    {
                        label: 'Redo',
                        accelerator: 'CmdOrCtrl+Shift+Z',
                        click () { appWindow.webContents.send('redo'); }
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Zoom In',
                        accelerator: 'CmdOrCtrl+Plus',
                        click () { appWindow.webContents.send('zoomIn'); }
                    },
                    {
                        label: 'Zoom Out',
                        accelerator: 'CmdOrCtrl+-',
                        click () { appWindow.webContents.send('zoomOut'); }
                    },
                    {
                        label: 'Default zoom',
                        accelerator: 'CmdOrCtrl+0',
                        click () { appWindow.webContents.send('defaultZoom'); }
                    },
                ]
            },
            {
                label: 'Tools',
                submenu: [
                    {
                        label: 'Crop',
                        accelerator: 'C',
                        click () { appWindow.webContents.send('crop'); }
                    },
                    {
                        label: 'Arrow',
                        accelerator: 'A',
                        click () { appWindow.webContents.send('arrow'); }
                    },
                    {
                        label: 'Rect',
                        accelerator: 'R',
                        click () { appWindow.webContents.send('rect'); }
                    },
                    {
                        label: 'Pen',
                        accelerator: 'B',
                        click () { appWindow.webContents.send('pen'); }
                    },
                ]
            },
            {
                label: 'More',
                submenu: [
                    {
                        label: 'Help',
                        accelerator: 'F1',
                        click () { appWindow.webContents.send('help'); }
                    },
                    {
                        label: 'Shortcut',
                        accelerator: 'F2',
                        click () { appWindow.webContents.send('shortcut'); }
                    },
                    {
                        label: 'Settings',
                        accelerator: 'S',
                        click () { appWindow.webContents.send('settings'); }
                    },
                    {
                        label: 'Sign In',
                        accelerator: 'I',
                        click () { appWindow.webContents.send('signin'); }
                    },
                    {
                        label: 'Check for updates',
                        click () { appWindow.webContents.send('updates'); }
                    },
                    {
                        label: 'About',
                        click () { shell.openExternal('https://github.com/binjospookie/--shots'); }
                    }
                ]
            },
        ]
    );
};
