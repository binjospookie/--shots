const renderIpc = require('./ipcRendered');

module.exports =
	function ipcAdd(
		undoCrop,redoCrop,setDefaultSceneState,createScreenshot,callCrop,callRect,callPen,body,modalWindow,getDrawStatus,callZoomIn, callZoomOut, setDefaultZoom, callArrow, callSave,
	shortcutWindow,settingsWindow ) {
	renderIpc.undo(undoCrop, body);
	renderIpc.redo(redoCrop, body);
	renderIpc.stop(body, modalWindow,setDefaultSceneState,shortcutWindow, settingsWindow);
	renderIpc.newShot(createScreenshot, body);
	renderIpc.crop(callCrop, body);
	renderIpc.rect(callRect, body);
	renderIpc.pen(callPen, body);
	renderIpc.help(body, modalWindow, getDrawStatus,shortcutWindow, settingsWindow);
	renderIpc.settings(body, modalWindow, getDrawStatus,shortcutWindow, settingsWindow);
	renderIpc.shortcut(body, shortcutWindow, getDrawStatus, modalWindow, settingsWindow);
	renderIpc.zoomIn(callZoomIn, body);
	renderIpc.zoomOut(callZoomOut, body);
	renderIpc.defaultZoom(setDefaultZoom, body);
	renderIpc.callArrow(callArrow, body);
	renderIpc.callSave(callSave, body);
	renderIpc.updates(body);
};
