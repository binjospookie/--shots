const renderIpc = require('./ipcRendered');

module.exports =
function ipcAdd(
   undoCrop, redoCrop, setDefaultSceneState, createScreenshot, callCrop,
   callRect, callPen, body, modalWindow, getDrawStatus, callZoomIn, callZoomOut,
   setDefaultZoom, callArrow, callSave, shortcutWindow, settingsWindow,
   signinWindow, createEmoji) {
  renderIpc.undo(undoCrop, body);
  renderIpc.redo(redoCrop, body);
  renderIpc.stop(body, modalWindow, setDefaultSceneState, shortcutWindow,
  settingsWindow, signinWindow);
  renderIpc.newShot(createScreenshot, body);
  renderIpc.crop(callCrop, body);
  renderIpc.rect(callRect, body);
  renderIpc.pen(callPen, body);
  renderIpc.signin(body, modalWindow, getDrawStatus, shortcutWindow,
  settingsWindow, signinWindow);
  renderIpc.help(body, modalWindow, getDrawStatus, shortcutWindow,
  settingsWindow, signinWindow);
  renderIpc.settings(body, modalWindow, getDrawStatus, shortcutWindow,
  settingsWindow, signinWindow);
  renderIpc.shortcut(body, shortcutWindow, getDrawStatus, modalWindow,
  settingsWindow, signinWindow);
  renderIpc.zoomIn(callZoomIn, body);
  renderIpc.zoomOut(callZoomOut, body);
  renderIpc.defaultZoom(setDefaultZoom, body);
  renderIpc.callArrow(callArrow, body);
  renderIpc.callSave(callSave, body);
  renderIpc.updates(body);
  renderIpc.signOut(body, signinWindow);
  renderIpc.emoji(createEmoji);
};
