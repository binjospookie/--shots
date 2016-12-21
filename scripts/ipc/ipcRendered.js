/* eslint-disable */
const { ipcRenderer } = require('electron');
const ipc = require('electron').ipcRenderer;
const popUp = require('../functions/popUp');
const popupWindow = document.querySelector('aside#messageToUser');
const popupText = popupWindow.querySelector('p');
const os = require('os');

function undo(undoCrop, body, textSidebar) {
  ipcRenderer.on('undo', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    undoCrop();
  });
}
function redo(redoCrop, body, textSidebar) {
  ipcRenderer.on('redo', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    redoCrop();
  });
}
function stop(body, modalWindow, setDefaultSceneState, shortcutWindow,
  settingsWindow, signinWindow) {
  ipcRenderer.on('stop', () => {
    setDefaultSceneState();
    shortcutWindow.classList.remove('open');
    modalWindow.classList.remove('open');
    settingsWindow.classList.remove('open');
    signinWindow.classList.remove('open');
    body.classList.remove('modal');
    body.classList.remove('text');
  });
}
function newShot(createScreenshot, body) {
  ipcRenderer.on('new', (event, flag) => {
    if (body.classList.contains('modal')) {
      return;
    }
    createScreenshot(flag);
  });
}
function crop(callCrop, body, textSidebar) {
  ipcRenderer.on('crop', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    callCrop();
  });
}
function rect(callRect, body, textSidebar) {
  ipcRenderer.on('rect', (sender, param) => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    callRect(param);
  });
}
function pen(callPen, body, textSidebar) {
  ipcRenderer.on('pen', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    callPen();
  });
}

function signin(body, shortcutWindow, getDrawStatus, modalWindow,
  settingsWindow, signinWindow, textSidebar) {
  ipcRenderer.on('signin', () => {
    if (document.activeElement.tagName === "INPUT" || textSidebar.classList.contains('show')) {
      return;
    }
    let areaZoom = body.style.transform;
    if (getDrawStatus() === false) {
      if (modalWindow.classList.contains('open') ||
            settingsWindow.classList.contains('open') ||
            shortcutWindow.classList.contains('open')) {
        modalWindow.classList.remove('open');
        settingsWindow.classList.remove('open');
        shortcutWindow.classList.remove('open');
      } else {
        body.classList.toggle('modal');
      }
      areaZoom = scaleToNumber(areaZoom);
      if (areaZoom !== 0) {
        signinWindow.style.transform = `scale(${1 / areaZoom})`;
      }
      signinWindow.classList.toggle('open');
    }
    if (localStorage.getItem('token') !== null) {
      ipc.send('open-signin-dialog');
      body.classList.remove('modal');
      signinWindow.classList.remove('open');
      return;
    }
  });
}

function help(body, modalWindow, getDrawStatus, shortcutWindow,
  settingsWindow, signinWindow) {
  ipcRenderer.on('help', () => {
    let areaZoom = body.style.transform;
    if (getDrawStatus() === false) {
      if (shortcutWindow.classList.contains('open') ||
          settingsWindow.classList.contains('open') ||
          signinWindow.classList.contains('open')) {
        shortcutWindow.classList.remove('open');
        settingsWindow.classList.remove('open');
        signinWindow.classList.remove('open');
      } else {
        body.classList.toggle('modal');
      }
      areaZoom = scaleToNumber(areaZoom);
      if (areaZoom !== 0) {
        modalWindow.style.transform = `scale(${1 / areaZoom})`;
      }
      modalWindow.classList.toggle('open');
    }
  });
}
function shortcut(body, shortcutWindow, getDrawStatus, modalWindow,
  settingsWindow, signinWindow) {
  ipcRenderer.on('shortcut', () => {
    let areaZoom = body.style.transform;
    if (getDrawStatus() === false) {
      if (modalWindow.classList.contains('open') ||
          settingsWindow.classList.contains('open') ||
          signinWindow.classList.contains('open')) {
        modalWindow.classList.remove('open');
        settingsWindow.classList.remove('open');
        signinWindow.classList.remove('open');
      } else {
        body.classList.toggle('modal');
      }
      areaZoom = scaleToNumber(areaZoom);
      if (areaZoom !== 0) {
        shortcutWindow.style.transform = `scale(${1 / areaZoom})`;
      }
      shortcutWindow.classList.toggle('open');
    }
  });
}

function settings(body, shortcutWindow, getDrawStatus, modalWindow,
  settingsWindow, signinWindow, textSidebar) {
  ipcRenderer.on('settings', () => {
    if (document.activeElement.tagName === 'INPUT' || textSidebar.classList.contains('show')) {
      return;
    }
    let areaZoom = body.style.transform;

    if (getDrawStatus() === false) {
      if (modalWindow.classList.contains('open') ||
         shortcutWindow.classList.contains('open') ||
         signinWindow.classList.contains('open')) {
        modalWindow.classList.remove('open');
        shortcutWindow.classList.remove('open');
        signinWindow.classList.remove('open');
      } else {
        body.classList.toggle('modal');
      }
      areaZoom = scaleToNumber(areaZoom);
      if (areaZoom !== 0) {
        settingsWindow.style.transform = `scale(${1 / areaZoom})`;
      }
      settingsWindow.classList.toggle('open');
    }
  });
}

function scaleToNumber(areaZoom) {
  areaZoom = areaZoom.replace('scale(', '');
  areaZoom = areaZoom.replace(')', '');
  areaZoom = Number(areaZoom);

  return areaZoom;
}

function zoomIn(callZoomIn, body, textSidebar) {
  ipcRenderer.on('zoomIn', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    callZoomIn();
  });
}

function zoomOut(callZoomOut, body, textSidebar) {
  ipcRenderer.on('zoomOut', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    callZoomOut();
  });
}
function signOut(body, signinWindow, textSidebar) {
  ipcRenderer.on('signout', () => {
    if (textSidebar.classList.contains('show')) {
      return;
    }
    localStorage.removeItem('token');
    body.classList.add('modal');
    signinWindow.classList.add('open');
  });
}

function defaultZoom(setDefaultZoom, body, textSidebar) {
  ipcRenderer.on('defaultZoom', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    setDefaultZoom();
  });
}
function callArrow(callArrow, body, textSidebar) {
  ipcRenderer.on('arrow', () => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    callArrow();
  });
}
function callSave(callSave, body, textSidebar) {
  ipcRenderer.on('save', (event, flag) => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    callSave(flag);
  });
}
function text(body, textSidebar) {
  ipcRenderer.on('text', (event) => {
    if (body.classList.contains('modal') || textSidebar.classList.contains('show')) {
      return;
    }
    body.classList.add('text');
  });
}
function emoji(createEmoji, textSidebar) {
  ipcRenderer.on('emoji', (event, type) => {
    if (textSidebar.classList.contains('show')) {
      return;
    }
    createEmoji(type);
  });
}
function updates(body, version) {
  ipcRenderer.on('updates', () => {
    if (body.classList.contains('modal')) {
      return;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://theshots.ru/checkUpdates.php');
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
            /**
             * Linux
             * Mac
             * Windows
             */
            let arrayOfVersions = xhr.responseText.split('$');
            let versionForShow;

            switch (os.type()) {
              case 'Linux':
                versionForShow = arrayOfVersions[0];
                break;
              case 'Darwin':
                versionForShow = arrayOfVersions[1];
                break;
              default:
                versionForShow = arrayOfVersions[2];
                break;
            }
            popUp(popupWindow, popupText, `Actual version is "${versionForShow}". Your version is ${version}.`);
          }
          break;

        default:
          popUp(popupWindow, popupText, 'Unknown error 😱');
          break;
      }
    };
  });
}

module.exports = {
  undo: undo,
  redo: redo,
  stop: stop,
  newShot: newShot,
  crop: crop,
  rect: rect,
  pen: pen,
  help: help,
  zoomIn: zoomIn,
  zoomOut: zoomOut,
  defaultZoom: defaultZoom,
  callArrow: callArrow,
  callSave: callSave,
  shortcut: shortcut,
  settings: settings,
  updates: updates,
  signin: signin,
  signOut: signOut,
  emoji: emoji,
  text: text
};
