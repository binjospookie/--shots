const renderIpc = require('./ipcRendered');

module.exports =
function ipcAdd(
   undoCrop, redoCrop, setDefaultSceneState, createScreenshot, callCrop,
   callRect, callPen, body, modalWindow, getDrawStatus, callZoomIn, callZoomOut,
   setDefaultZoom, callArrow, callSave, shortcutWindow, settingsWindow,
   signinWindow, createEmoji, APP_VERSION, textSidebar) {
  renderIpc.undo(undoCrop, body, textSidebar);
  renderIpc.redo(redoCrop, body, textSidebar);
  renderIpc.stop(body, modalWindow, setDefaultSceneState, shortcutWindow,
  settingsWindow, signinWindow);
  renderIpc.newShot(createScreenshot, body);
  renderIpc.crop(callCrop, body, textSidebar);
  renderIpc.rect(callRect, body, textSidebar);
  renderIpc.pen(callPen, body, textSidebar);
  renderIpc.signin(body, modalWindow, getDrawStatus, shortcutWindow,
  settingsWindow, signinWindow, textSidebar);
  renderIpc.help(body, modalWindow, getDrawStatus, shortcutWindow,
  settingsWindow, signinWindow);
  renderIpc.settings(body, modalWindow, getDrawStatus, shortcutWindow,
  settingsWindow, signinWindow, textSidebar);
  renderIpc.shortcut(body, shortcutWindow, getDrawStatus, modalWindow,
  settingsWindow, signinWindow);
  renderIpc.zoomIn(callZoomIn, body, textSidebar);
  renderIpc.zoomOut(callZoomOut, body, textSidebar);
  renderIpc.defaultZoom(setDefaultZoom, body, textSidebar);
  renderIpc.callArrow(callArrow, body, textSidebar);
  renderIpc.callSave(callSave, body, textSidebar);
  renderIpc.updates(body, APP_VERSION);
  renderIpc.signOut(body, signinWindow, textSidebar);
  renderIpc.emoji(createEmoji, textSidebar);
  renderIpc.text(body, textSidebar);
};
