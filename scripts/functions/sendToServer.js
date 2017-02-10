const { clipboard } = require('electron');
const popUp = require('./popUp');
const popupWindow = document.querySelector('aside#messageToUser');
const popupText = popupWindow.querySelector('p');

const xhr = new XMLHttpRequest();

module.exports = function sendToServer(code, old, loader, loaderText, path) {

  let arg = false;
  if (typeof arguments[4] == 'function')
    arg = arguments[4]

  const data = new FormData();
  let now;
  let difference;
  let callAfter;
  const storage = localStorage.getItem('serverpath');
  const token = (localStorage.getItem('token') !== null)
    ? JSON.parse(localStorage.getItem('token')).token : '';

  const pathToServer = (storage === null || storage === '') ?
    'https://theshots.ru/savephoto.php' : JSON.parse(storage);

  let newText = (path === undefined) ? 'Send and copied to buffer' :
  `Send, saved at '${path}'  and copied to buffer`;
    
  if (typeof path == 'function') {
    newText = `Posted on ${arguments[5]}`;
  }  

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
          
          //sharing
          if(arg) {
            arg();
          }
        }

        break;

      default:
        popUp(popupWindow, popupText, 'Unknown error 😱');
        break;
    }
  };

  window.addEventListener('keydown', event => {
    if (event.which === 27) {
      if (loader.classList.contains('show')) {
        xhr.abort();
        hideLoader(3000, 'Abort', loaderText);
      }
    }
  });

};
