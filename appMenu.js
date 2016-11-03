const { shell } = require('electron');

module.exports = function appMenu(app, appWindow) {
  return (
    [
      {
        label: 'File',
        submenu: [
          {
            label: 'New shot',
            accelerator: 'CmdOrCtrl+N',
            click() { appWindow.webContents.send('new'); },
          },
          {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click() { appWindow.webContents.send('save'); },
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
            label: 'Emoji',
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
                label: 'Expressionless face',
                accelerator: 'Alt+E',
                click() { appWindow.webContents.send('emoji', 'expressionless'); },
              },
              {
                label: 'Eyes',
                accelerator: 'Alt+R',
                click() { appWindow.webContents.send('emoji', 'eyes'); },
              },
              {
                label: 'Fire',
                accelerator: 'Alt+T',
                click() { appWindow.webContents.send('emoji', 'fire'); },
              },
              {
                label: 'Loudly crying face',
                accelerator: 'Alt+Y',
                click() { appWindow.webContents.send('emoji', 'loudly'); },
              },
              {
                label: 'OMG',
                accelerator: 'Alt+U',
                click() { appWindow.webContents.send('emoji', 'omg'); },
              },
              {
                label: 'Parrot',
                accelerator: 'Alt+I',
                click() { appWindow.webContents.send('emoji', 'parrot'); },
              },
              {
                label: 'Poop',
                accelerator: 'Alt+O',
                click() { appWindow.webContents.send('emoji', 'poop'); },
              },
              {
                label: 'See no evil monkey',
                accelerator: 'Alt+P',
                click() { appWindow.webContents.send('emoji', 'monkey'); },
              },
              {
                label: 'Thinking face',
                accelerator: 'Alt+A',
                click() { appWindow.webContents.send('emoji', 'thinking'); },
              },
              {
                label: 'Thumbs up',
                accelerator: 'Alt+S',
                click() { appWindow.webContents.send('emoji', 'up'); },
              },
              {
                label: 'Upside down face',
                accelerator: 'Alt+D',
                click() { appWindow.webContents.send('emoji', 'upside'); },
              },
              {
                label: 'Waving hand sign',
                accelerator: 'Alt+F',
                click() { appWindow.webContents.send('emoji', 'hand'); },
              },
            ],
          },
        ],
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
            label: 'Check for updates',
            click() { appWindow.webContents.send('updates'); },
          },
          {
            label: 'Source code',
            click() { shell.openExternal('https://github.com/binjospookie/--shots'); },
          },
        ],
      },
    ]
  );
};
