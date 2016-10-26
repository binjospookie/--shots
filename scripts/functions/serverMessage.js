const popUp = require('./popUp');
const popupWindow = document.querySelector('aside#messageToUser');
const popupText = popupWindow.querySelector('p');

module.exports = function serverMessage(version) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://theshots.ru/serverMessage.php');
  xhr.send();
  xhr.onload = () => {
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
            if (xhr.responseText !== '' &&
            xhr.responseText !== 'This is deprecated version. Please update the app to version 0.1.1.') {
              popUp(popupWindow, popupText, xhr.responseText, true);
            }
        }
        break;

      default:
        popUp(popupWindow, popupText, 'Unknown error 😱');
        break;
    }
  };
};
