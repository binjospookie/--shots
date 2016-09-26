const {ipcRenderer} = require('electron');

function undo(undoCrop) {
	ipcRenderer.on('undo', () => {
		undoCrop();
	});
}
function redo(redoCrop) {
	ipcRenderer.on('redo', () => {
		redoCrop();
	});
}
function stop(body, modalWindow,setDefaultSceneState) {
	ipcRenderer.on('stop', () => {
		setDefaultSceneState();
		modalWindow.classList.remove('open');
		body.classList.remove('modal');
	});
}
function newShot(createScreenshot) {
	ipcRenderer.on('new', () => {
		createScreenshot();
	});
}
function crop(callCrop) {
	ipcRenderer.on('crop', () => {
		callCrop();
	});
}
function rect(callRect) {
	ipcRenderer.on('rect', () => {
		callRect();
	});
}
function pen(callPen) {
	ipcRenderer.on('pen', () => {
		callPen();
	});
}
function help(body, modalWindow, getDrawStatus) {
	ipcRenderer.on('help', () => {
		if(getDrawStatus() === false) {
			modalWindow.classList.toggle('open');
			body.classList.toggle('modal');
		}
	});
}

function zoomIn(callZoomIn) {
	ipcRenderer.on('zoomIn', () => {
		callZoomIn();
	});
}

function zoomOut(callZoomOut) {
	ipcRenderer.on('zoomOut', () => {
		callZoomOut();
	});
}
function defaultZoom(setDefaultZoom) {
	ipcRenderer.on('defaultZoom', () => {
		setDefaultZoom();
	});
}
function callArrow(callArrow) {
	ipcRenderer.on('arrow', () => {
		callArrow();
	});
}
function callSave(callSave) {
	ipcRenderer.on('save', () => {
		callSave();
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
	callSave: callSave
};
