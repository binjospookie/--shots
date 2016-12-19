const ipc = require('electron').ipcRenderer;
const pathVisual = document.querySelector('form div.path');
const setCustomPathButton = document.querySelector('form button.save-custom');
const setDefaultPathButton = document.querySelector('form button.save-default');

setCustomPathButton.addEventListener('click', ()=>{
  ipc.send('open-save-dialog');
});

ipc.on('savePath', (event, path)=> {
  if (path !== undefined) {
    pathVisual.textContent = `Selected: ${path[0]}`;
    localStorage.setItem('savePath', path[0]);
  }
});

setDefaultPathButton.addEventListener('click', ()=>{
  pathVisual.textContent = `Selected: default`;
  localStorage.removeItem('savePath');
});
