const { clipboard } = require('electron');
const popUp = require('./popUp');
const popupWindow = document.querySelector('aside#messageToUser');
const popupText = popupWindow.querySelector('p');

module.exports = function sendToServer(code, old, loader, loaderText, path) {
  const data = new FormData();
  const xhr = new XMLHttpRequest()
  let now;
  let difference;
  let callAfter;
  const storage = localStorage.getItem('serverpath');
  const token = (localStorage.getItem('token') !== null)
    ? JSON.parse(localStorage.getItem('token')).token : '';

  const pathToServer = (storage === null || storage === '') ?
    'https://theshots.ru/savephoto.php' : JSON.parse(storage);

  const newText = (path === undefined) ? 'Send and copied to buffer' :
  `Send, saved at '${path}'  and copied to buffer`;


  data.append('shot', code);
  data.append('token', token);
  xhr.open('POST', pathToServer);
  xhr.send(data);
  xhr.onload = () => {
    let data;

    now = new Date();
    difference = Math.abs(now - old);

    if (difference >= 2000) {
      loaderText.textContent = newText;
      setTimeout(() => {
        loader.classList.remove('show');
      }, 1500)
    } else {
      loaderText.textContent = newText;
      callAfter = 2000 - difference;
      setTimeout(() => {
        loader.classList.remove('show');
      }, callAfter)
    }

    switch (xhr.status) {
      case 500:
        popUp(popupWindow, popupText, 'Server error 😱');
        break;

      case 400:
        popUp(popupWindow, popupText, 'An impossible request 😱');
        break;

      case 401:
        popUp(popupWindow, popupText, 'Auth error 😱');
        break;

      case 200:
        if (xhr) {
          data = JSON.parse(xhr.responseText);
          clipboard.writeText(data);
        }

        break;

      default:
        popUp(popupWindow, popupText, 'Unknown error 😱');
        break;
    }
  };
};
