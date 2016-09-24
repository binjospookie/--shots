/**
 * Функция создания меню
 */
const electron = require('electron');
const {remote} = require('electron');
const {Menu, MenuItem} = remote;
const menu = new Menu();

module.exports = function Menu(stage,stageMouseDownHandler, stageMouseUpHandler, stageMouseMoveHandler, openNewScreenshotDialog, callCrop, callRect, callPen) {
	menu.append( new MenuItem( {
		label: 'New', click() {
			openNewScreenshotDialog();
		}
	} ) );
	menu.append( new MenuItem( { type: 'separator' } ) );
	menu.append( new MenuItem( {
		label: 'Crop', click() {
			callCrop();
		}
	} ) );
	menu.append( new MenuItem( { type: 'separator' } ) );
	menu.append( new MenuItem( {
		label: 'Save', click() {
			console.log( 'item 1 clicked' )
		}
	} ) );

	menu.append( new MenuItem( { type: 'separator' } ) );
	menu.append( new MenuItem( {
		label: 'Arrow', click() {
			addArrow()
		}
	} ) );
	menu.append( new MenuItem( { type: 'separator' } ) );
	menu.append( new MenuItem( {
		label: 'Rect', click() {
			callRect()
		}
	} ) );
	menu.append( new MenuItem( { type: 'separator' } ) );
	menu.append( new MenuItem( {
		label: 'Text', click() {
			console.log( 'item 1 clicked' )
		}
	} ) );
	menu.append( new MenuItem( { type: 'separator' } ) );
	menu.append( new MenuItem( {
		label: 'Pen', click() {
			callPen();
		}
	} ) );

	//обработчик контекстного меню
	window.addEventListener('contextmenu', (event) => {
		event.preventDefault();
		menu.popup(remote.getCurrentWindow());
	}, false);

	function addArrow() {
		alert('lol');
	}
};
