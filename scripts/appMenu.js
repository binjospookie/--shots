const { shell, clipboard } = require('electron');
const dialog = require('electron').dialog;
const newShotDialog = {
    type: 'info',
    title: 'Create new shot',
    message: 'All your progress will be lost. Are you sure?',
    buttons: ['Yes', 'No']
};
module.exports = function appMenu(app, appWindow) {
  return (
    [
      {
        label: 'File',
        submenu: [
          {
            label: 'New shot',
            accelerator: 'CmdOrCtrl+N',
            click() {
              appWindow.webContents.send('saveState');
             },
          },
          {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click() { appWindow.webContents.send('save'); },
          },
          {
            label: 'Local save',
            accelerator: 'CmdOrCtrl+L',
            click() { appWindow.webContents.send('save', 'local') },
          },
          {
            label: 'Minimize to tray',
            accelerator: 'CmdOrCtrl+M',
            click() { appWindow.hide(); },
          },
          {
            label: 'Restart',
            accelerator: 'CmdOrCtrl+R',
            click() {
              app.relaunch();
              app.exit(0);
            },
          },
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click() { app.quit(); },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            click() { appWindow.webContents.send('undo'); },
          },
          {
            label: 'Redo',
            accelerator: 'CmdOrCtrl+Shift+Z',
            click() { appWindow.webContents.send('redo'); },
          },
          {
            label: 'Settings',
            accelerator: 'S',
            click() { appWindow.webContents.send('settings'); },
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+Plus',
            click() { appWindow.webContents.send('zoomIn'); },
          },
          {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-',
            click() { appWindow.webContents.send('zoomOut'); },
          },
          {
            label: 'Default zoom',
            accelerator: 'CmdOrCtrl+0',
            click() { appWindow.webContents.send('defaultZoom'); },
          },
        ],
      },
      {
        label: 'Tools',
        submenu: [
          {
            label: 'Default',
            accelerator: 'D',
            click() { appWindow.webContents.send('stop'); },
          },
          {
            label: 'Crop',
            accelerator: 'C',
            click() { appWindow.webContents.send('crop'); },
          },
          {
            label: 'Arrow',
            accelerator: 'A',
            click() { appWindow.webContents.send('arrow'); },
          },
          {
            label: 'Rect',
            accelerator: 'R',
            click() { appWindow.webContents.send('rect'); },
          },
          {
            label: 'Pen',
            accelerator: 'B',
            click() { appWindow.webContents.send('pen'); },
          },
          {
            label: 'Blur',
            accelerator: 'F',
            click() { appWindow.webContents.send('rect', 'filled'); },
          },
          {
            label: 'Text',
            accelerator: 'T',
            click() { appWindow.webContents.send('text'); },
          },
          {
            label: 'Stickers',
            submenu: [
              {
                label: 'Angry face',
                accelerator: 'Alt+Q',
                click() { appWindow.webContents.send('emoji', 'angry'); },
              },
              {
                label: 'Bug',
                accelerator: 'Alt+W',
                click() { appWindow.webContents.send('emoji', 'bug'); },
              },
              {
                label: 'Doge',
                accelerator: 'Alt+E',
                click() { appWindow.webContents.send('emoji', 'doge'); },
              },
              {
                label: 'Expressionless face',
                accelerator: 'Alt+R',
                click() { appWindow.webContents.send('emoji', 'expressionless'); },
              },
              {
                label: 'Eyes',
                accelerator: 'Alt+T',
                click() { appWindow.webContents.send('emoji', 'eyes'); },
              },
              {
                label: 'Facepalm',
                accelerator: 'Alt+Y',
                click() { appWindow.webContents.send('emoji', 'facepalm'); },
              },
              {
                label: 'Fire',
                accelerator: 'Alt+U',
                click() { appWindow.webContents.send('emoji', 'fire'); },
              },
              {
                label: 'Loudly crying face',
                accelerator: 'Alt+I',
                click() { appWindow.webContents.send('emoji', 'loudly'); },
              },
              {
                label: 'OMG',
                accelerator: 'Alt+O',
                click() { appWindow.webContents.send('emoji', 'omg'); },
              },
              {
                label: 'Parrot',
                accelerator: 'Alt+P',
                click() { appWindow.webContents.send('emoji', 'parrot'); },
              },
              {
                label: 'Pepe frog',
                accelerator: 'Alt+A',
                click() { appWindow.webContents.send('emoji', 'pepe'); },
              },
              {
                label: 'Poop',
                accelerator: 'Alt+S',
                click() { appWindow.webContents.send('emoji', 'poop'); },
              },
              {
                label: 'See no evil monkey',
                accelerator: 'Alt+D',
                click() { appWindow.webContents.send('emoji', 'monkey'); },
              },
              {
                label: 'Thinking face',
                accelerator: 'Alt+F',
                click() { appWindow.webContents.send('emoji', 'thinking'); },
              },
              {
                label: 'Thumbs up',
                accelerator: 'Alt+G',
                click() { appWindow.webContents.send('emoji', 'up'); },
              },
              {
                label: 'Upside down face',
                accelerator: 'Alt+H',
                click() { appWindow.webContents.send('emoji', 'upside'); },
              },
              {
                label: 'Yoba face',
                accelerator: 'Alt+J',
                click() { appWindow.webContents.send('emoji', 'yoba'); },
              },
              {
                label: 'Waving hand sign',
                accelerator: 'Alt+K',
                click() { appWindow.webContents.send('emoji', 'hand'); },
              },
            ],
          },
        ],
      },
      {
        label: 'Socials',
        submenu: [
          {
            label: 'Post on Facebook',
            accelerator: 'Shift+F',
            click() {
              appWindow.webContents.send('facebook');
            }
          },
          {
            label: 'Post on Twitter',
            accelerator: 'Shift+T',
            click() {
              appWindow.webContents.send('twitter');
            }
          },
          {
            label: 'Post on Vkontakte',
            accelerator: 'Shift+V',
            click() {
              appWindow.webContents.send('vkontakte');
            }
          }
        ]
      },
      {
        label: 'More',
        submenu: [
          {
            label: 'Help',
            accelerator: 'F1',
            click() { appWindow.webContents.send('help'); },
          },
          {
            label: 'Shortcuts',
            accelerator: 'F2',
            click() { appWindow.webContents.send('shortcut'); },
          },
          {
            label: 'Sign In',
            accelerator: 'I',
            click() { appWindow.webContents.send('signin'); },
          },
          {
            label: 'Admin panel',
            click() { shell.openExternal('https://theshots.ru/admin/'); },
          },
          {
            label: 'Check for updates',
            click() { appWindow.webContents.send('updates'); },
          },
          {
            label: 'Source code',
            click() { shell.openExternal('https://github.com/binjospookie/--shots'); },
          },
          {
            label: 'Leave a feedback',
            click() { shell.openExternal('https://theshots.ru/feedback'); },
          },
        ],
      },
    ]
  );
};
