const renderIpc = require('./ipcRendered');

module.exports =
	function ipcAdd(
		undoCrop,redoCrop,setDefaultSceneState,createScreenshot,callCrop,callRect,callPen,body,modalWindow,getDrawStatus,callZoomIn, callZoomOut, setDefaultZoom ) {
	renderIpc.undo(undoCrop);
	renderIpc.redo(redoCrop);
	renderIpc.stop(body, modalWindow,setDefaultSceneState);
	renderIpc.newShot(createScreenshot);
	renderIpc.crop(callCrop);
	renderIpc.rect(callRect);
	renderIpc.pen(callPen);
	renderIpc.help(body, modalWindow, getDrawStatus);
	renderIpc.zoomIn(callZoomIn);
	renderIpc.zoomOut(callZoomOut);
	renderIpc.defaultZoom(setDefaultZoom);
};
