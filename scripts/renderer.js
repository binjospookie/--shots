/* eslint-disable */
const CLOSE = 'close';
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.5;
// работа с меню
const Menu = require('./menu');
// создание скриншота
const addScreenshot = require('./functions/addScreenshot');
const electron = require('electron');
const fs = require('fs');
const path = require('path');
const isOnline = require('is-online');
const {
    ipcRenderer
} = require('electron');
const nativeImage = electron.nativeImage;
const ipc = require('electron').ipcRenderer;
window.onerror = function(error, url, line) {
    ipc.send('errorInWindow', error);
};
const ipcAdd = require('./ipc/ipcAdd');
const determineScreenShotSize = require('./functions/determineScreenShotSize');
const {
    clipboard,
} = require('electron');
// Позиция по X, куда пришлось нажатие кнопки мыши
let mouseDownX;
// Позиция по Y, куда пришлось нажатие кнопки мыши
let mouseDownY;
// Рамка, которая указывает на область кропа
const frame = document.getElementById('frame');
const loader = document.getElementById('loader');
const loaderText = loader.querySelector('span');
const shortcutWindow = document.querySelector('.shortcut');
const settings = document.querySelector('aside.settings');
const applyCustomSettingsButton = settings.querySelector('#applyCustom');
const settingFieldsets = settings.querySelectorAll('fieldset');
const signinWindow = document.querySelector('aside.sign-in');
const setDefaultFrame = require('./functions/setDefaultFrame');
// сам canvas
const workArea = document.querySelector('canvas');
// определяем сцену для работы с easel
const stage = new createjs.Stage('stage');
// определяем контекст канваса
const ctx = workArea.getContext('2d');
// создаём img для добавления на канвас
let image = new Image();
// битмап для изображения
let bitmap;
// размеры окна
let thumbSize;
let fillObj;
// Body-element
const body = document.body;
// обработчик нажатия на кнопки закрытия в модальном окне
const closeModalButtonClickHandler = require('./functions/closeModal');
const shapeColorPicker = document.querySelector('input[name="shapecolor"]');
// толщина карандаша
const penSize = 4;
const popupWindow = document.querySelector('aside#messageToUser');
const popupText = popupWindow.querySelector('p');
const popUp = require('./functions/popUp');
const addModalButtonListeners = require('./functions/addModalButtonListeners');
const createDeleteButton = require('./functions/createDeleteButton');
const createTransformButton = require('./functions/createTransformButton');
const createEditButton = require('./functions/createEditButton');
const hideControls = require('./functions/hideControls');
const showControls = require('./functions/showControls');
const cropListeners = require('./functions/cropListeners');
const penListeners = require('./functions/penListeners');
const rectListeners = require('./functions/rectListeners');
const arrowListeners = require('./functions/arrowListeners');
const textEventListeners = require('./functions/textEventListeners');
const setDefaultScene = require('./functions/setDefaultScene');
const modalOnStart = require('./functions/modalOnStart');
const setTransformRectDistance = require('./functions/setTransformRectDistance');
const initSettings = require('./functions/initSettings');
const initCommonSettings = require('./functions/initCommonSettings');
const setFieldsetStatus = require('./functions/setFieldsetStatus');
const sendToServer = require('./functions/sendToServer');
const getSettings = require('./functions/getSettings');
const decodeBase64Image = require('./functions/decodeBase64Image');
const hideLoader = require('./functions/hideLoader');
const serverMessage = require('./functions/serverMessage');
const serverButtonClickHandler = require('./functions/serverButtonClickHandler');
const signinFormSubmitHandler = require('./functions/signinFormSubmitHandler');
const calcAngle = require('./functions/calcAngle');
const preventDND = require('./functions/preventDND');
const sendToSocialNetwork = require('./functions/sendToSocialNetwork');
// Массив объектов, содержащих данные о каждом кропе.
let croppingHistory = [];
// Индекс текущего кусочка истории в массива
let historyIndex = 0;
// Текущая активная фигура
let activeShape;
// параметры блюра
const blurFilter = new createjs.BlurFilter(12, 12, 1);
// модальное окно с подсказкой
const modalWindow = document.querySelector('body>aside.hint');
// кнопки закрытия модального окна
const closeModalButtons = modalWindow.querySelectorAll('button');
const closeShortcutButtons = shortcutWindow.querySelectorAll('button');
const signinButtons = signinWindow.querySelectorAll('button[type="button"]');
const signinForm = signinWindow.querySelector('form');
const closeSettingsButtons = settings.querySelectorAll('button.close');
const serverButton = settings.querySelector('button#serverPath');
const textSidebar = document.getElementById('textSidebar');
const textareaContent = document.getElementById('textContent');
const textateaFontSize = document.getElementById('fontSize');
const textateaFontColor = document.getElementById('fontColor');
const deleteTextButton = document.getElementById('deleteText');
const applyTextButton = document.getElementById('applyText');
const closeTextFormButton = document.getElementById('closeTextForm');
let commonSettings = JSON.parse(localStorage.getItem('commonSettings'));
let DELAY_DURATION = 100;
let SHIFT_PRESSED;
let IN_PROCESS = false;
const APP_VERSION = ipcRenderer.sendSync('synchronous-message', 'version');
let oldBase;

window.addEventListener('keydown', event => {
  if (event.which === 16) {
    SHIFT_PRESSED = true;
  }
  if (event.which === 27) {
    setDefaultSceneState();
    shortcutWindow.classList.remove('open');
    modalWindow.classList.remove('open');
    settings.classList.remove('open');
    signinWindow.classList.remove('open');
    body.classList.remove('modal');
    body.classList.remove('text');
  }
});

window.addEventListener('keyup', event => {
  if (event.which === 16) {
    SHIFT_PRESSED = false;
  }
});

// старое значение по X при работе с карандашом
let penOldX;
// старое значение по Y при работе с карандашом
let penOldY;
// флаг, указывающий на процесс работы с инструментом
let onCreate = false;
let areaZoom = 1;
let scale;
preventDND(window);

stage.enableDOMEvents(true);
addModalButtonListeners(closeModalButtons, closeModalButtonClickHandler, body,
    modalWindow);
addModalButtonListeners(closeShortcutButtons, closeModalButtonClickHandler, body,
    shortcutWindow);
addModalButtonListeners(signinButtons, closeModalButtonClickHandler, body,
    signinWindow);
addModalButtonListeners(closeSettingsButtons, closeModalButtonClickHandler, body,
    settings);
signinForm.addEventListener('submit', signinFormSubmitHandler, false);
applyCustomSettingsButton.addEventListener('change', applyCustomSettingsButtonChangeHandler, false);
serverButton.addEventListener('click', serverButtonClickHandler, false);
// обработчик клика по сцене
stage.addEventListener('mousedown', stageMouseDownHandler, false);

    // Создаём меню приложения
Menu(
    stage, stageMouseDownHandlerCrop, stageMouseUpHandlerCrop,
    stageMouseMoveHandlerCrop, openNewScreenshotDialog, callCrop,
    callRect, callPen, callArrow, callSave, setDefaultSceneState, body);

ipcAdd(undoCrop, redoCrop, setDefaultSceneState, createScreenshot, callCrop,
    callRect, callPen, body, modalWindow, getDrawStatus, callZoomIn, callZoomOut,
    setDefaultZoom, callArrow, callSave, shortcutWindow, settings, signinWindow,
    createEmoji, APP_VERSION, textSidebar);

/**
 * Вешаем обработчики в форме изменения текста
 */
textEventListeners(textareaContent, textateaFontSize, textateaFontColor, textareaValueChangeHadler,
  textareaFontSizeChangeHadler, textareaFontColorChangeHadler, deleteTextButton, deleteTextButtonClickHandler,
  applyTextButton, applyTextButtonClickHandler, closeTextFormButton, textSidebar);

/**
 * Обработчик закртыия формы с текстом
 * @return {[type]}
 */
function applyTextButtonClickHandler() {
  hideControls(activeShape, stage);
  activeShape = undefined;
  stage.update();
  textSidebar.classList.remove('show');
}

/**
 * Обработчик удаления текста из формы
 * @return {[type]}
 */
function deleteTextButtonClickHandler() {
  stage.removeChild(activeShape);
  activeShape = undefined;
  stage.update();
  textSidebar.classList.remove('show');
}
/**
 * Обработчик изменения контента текста
 * @param  {[type]} event
 * @return {[type]}
 */
function textareaValueChangeHadler(event) {
  let textareaValue = event.target.value;

  activeShape.children[0].text = textareaValue;
  stage.update();
}

/**
 * Обработчик изменения кегля
 * @param  {[type]} event
 * @return {[type]}
 */
function textareaFontSizeChangeHadler(event) {
  let textareaFontSize = event.target.value;

  activeShape.children[0].font = `${textareaFontSize}px Roboto`;
  activeShape.children[1].y = activeShape.getBounds().y - 5;

  stage.update();
}

/**
 * Обработчик изменения текста
 * @param  {[type]} event
 * @return {[type]}
 */
function textareaFontColorChangeHadler(event) {
  let textareaColor = event.target.value;

  activeShape.children[0].color = textareaColor;
  stage.update();

}

// Метод вызова диалога о создании нового скриншота
function openNewScreenshotDialog() {
  if (workArea.toDataURL('', 'image/png') === oldBase) {
    ipcRenderer.sendSync('synchronous-message', 'createNew', 'dontask');
  } else {
    ipcRenderer.sendSync('synchronous-message', 'createNew', 'ask');
  }
}
initSettings(settings);
initCommonSettings(settings);
/**
 * Обработчик нажатия на сцене для выбора элементов
 */
function stageMouseDownHandler(event) {
  event.preventDefault();
  if (body.classList.contains('text')) {
    setDefaultSceneState();
    createText(event);
    return;
  }
  const target = event.target;
  const name = target.parent.name;
  // HACK: for MacOS
  if (name === 'close') {
    hideControls(activeShape, stage);
    stage.removeChild(activeShape);
    activeShape = undefined;
    stage.update();
    textSidebar.classList.remove('show');
    return;
  }
  if (name === 'edit') {
    openTextSidebar();
    return;
  }
  // закрытие модалки по чёрному пространству вокруг
  if (name === null && body.classList.contains('modal')) {
    modalWindow.classList.remove('open');
    shortcutWindow.classList.remove('open');
    settings.classList.remove('open');
    signinWindow.classList.remove('open');
    body.classList.remove('modal');
    return;
  }

  if (onCreate === false) {
    if (name) {
      if (name.indexOf('shapeContainer') !== -1) {
        if (activeShape !== target.parent) {
          hideControls(activeShape, stage);
          activeShape = target.parent;
          showControls(activeShape, stage);
        } else {
          const demensionX = activeShape.x - event.stageX;
          const demensionY = activeShape.y - event.stageY;

          if ((name.indexOf('Pen') === -1) && (onCreate === false) && (activeShape.children[0].filled !== true)) {
            activeShape.on('pressmove', (event) => {
              body.classList.add('move');

              activeShape.x = event.stageX + demensionX;
              activeShape.y = event.stageY + demensionY;
              stage.update();
            });

            activeShape.on('pressup', (event) => {
              body.classList.remove('move');
            });
          }
        }
      }
    } else if (name === null && activeShape !== undefined) {
      hideControls(activeShape, stage);
      activeShape = undefined;
      textSidebar.classList.remove('show');
      return;
    }
  }

  stage.update();
}

/**
 * Метод удаления фигуры
 */
function deleteShape(event) {
  activeShape = event.target.parent;

  if (activeShape.name === CLOSE) {
    activeShape = event.target.parent.parent;
  }

  if (activeShape.name === 'shapeContainerText') {
    textSidebar.classList.remove('show');
  }

  hideControls(activeShape, stage);
  stage.removeChild(activeShape);
  activeShape = undefined;
  stage.update();
}

/**
 * Обработчик отпускания клавиши мыши при работе с фигурами
 */
function stageMouseUpShapes() {
  const deleteButton = createDeleteButton();
  const transformButton = createTransformButton();
  if (activeShape.children.length === 0) {
    return;
  }
  deleteButton.addEventListener('click', deleteShape);

  if (penOldX !== undefined && penOldY !== undefined) {
    deleteButton.x = penOldX - 10;
    deleteButton.y = penOldY - 10;
  } else {
    let shape = activeShape.getChildByName('rect');
    let shapeBounds;

    if (shape === null) {
      shape = activeShape.getChildByName('arrow');
      shapeBounds = activeShape.getChildByName('arrow').getBounds();
    } else {
      shapeBounds = activeShape.getChildByName('rect').getBounds();
    }

    deleteButton.x = -10;
    deleteButton.y = -10;
    transformButton.x = shapeBounds.width + 10;
    transformButton.y = shapeBounds.height + 10;
    transformButton.addEventListener('mousedown', transformPressHandler);
    transformButton.addEventListener('pressmove', transformMoveHandler);
    transformButton.addEventListener('pressup', transformUpHandler);
  }

  const arrow = activeShape.getChildByName('arrow');

  if (arrow !== null) {
    transformButton.x = arrow.length + 25;
    transformButton.y = 10;
  }

  if (activeShape.children[0].filled !== true) {
    activeShape.addChild(transformButton);
  }

  if (activeShape.children[0].filled === true) {
    activeShape.removeChildAt(1);
    activeShape.removeChildAt(1);

    addOutline(activeShape);
  }

  activeShape.addChild(deleteButton);
  hideControls(activeShape, stage);

  penOldX = undefined;
  penOldY = undefined;
  activeShape = undefined;
}

/**
 * Обработчик нажатия при использовании трансформации
 */
function transformPressHandler(event) {
  mouseDownX = event.stageX;
  mouseDownY = event.stageY;
  scale = activeShape.scaleX;
  activeShape.removeAllEventListeners();

}
/**
 * Обработчик перемещения при использовании трансформации
 */
function transformMoveHandler(event) {
  let i;
  let n;
  const child = activeShape.children;
  const arrow = activeShape.getChildByName('arrow');
  const result =
      setTransformRectDistance(event.stageX, event.stageY, croppingHistory,
          historyIndex, activeShape, mouseDownX, mouseDownY);
  const distance1 = result.distance1;
  const distance2 = result.distance2;
  let shapeName;
  let degree;

  activeShape.scaleX = activeShape.scaleY =
      (distance2 / distance1) * scale;

  for (i = 0, n = activeShape.children.length; i < n; i++) {
    if ((child[i].name === 'transform')) {
      child[i].scaleX = child[i].scaleY = 1 / activeShape.scaleX;
      if (arrow !== null) {
        child[i].x = arrow.length + (25 / activeShape.scaleX);
        child[i].y = 10 / activeShape.scaleX;
      } else {
        child[i].x = activeShape.getBounds().width + (10 / activeShape.scaleX);
        child[i].y = activeShape.getBounds().height + (10 / activeShape.scaleX);
      }
    }

    if ((child[i].name === 'close')) {
      let rect = activeShape.getChildByName('rect');
      if (rect === null) {
        rect = activeShape.getChildByName('arrow');
        if (rect === null) {
          rect = activeShape.getChildByName('emoji');
        }
      }
      child[i].scaleX = child[i].scaleY = 1 / activeShape.scaleX;
      child[i].x = rect.x - (10 / activeShape.scaleX);
      child[i].y = rect.y - (10 / activeShape.scaleX);
    }

    if ((child[i].name === 'rect') || (child[i].name === 'outline')) {
      const width = child[i].getBounds().width;
      const height = child[i].getBounds().height;
      const top = child[i].y;
      const left = child[i].x;
      const name = child[i].name;
      const filled = child[i].filled;

      if (name === 'rect') {
        let penColor = shapeColorPicker.value;
        child[i].graphics.clear().setStrokeStyle(4 / activeShape.scaleX).beginStroke(penColor).drawRoundRect(left, top, width, height, 2 / activeShape.scaleX);
        shapeName = 'rect';
      } else {
        child[i].graphics.clear().setStrokeStyle(1 / activeShape.scaleX).beginStroke('#37aee2').drawRoundRect(left, top, width, height, 2 / activeShape.scaleX);
      }
    }

    if ((child[i].name === 'arrow')) {
      drawArrow(child[i], child[i].length);
      shapeName = 'arrow';
    }
  }

  degree = calcAngle(activeShape.x, activeShape.y, event.stageX - stage.x, event.stageY - stage.y);

  if (shapeName === 'arrow') {
    activeShape.rotation = degree;
  } else if(shapeName !== 'rect') {
    activeShape.rotation = -(45 - degree);
  }

  stage.update();

}

/**
 * Обработчик отпускания при использовании трансформации
 */
function transformUpHandler() {
  mouseDownX = 0;
  mouseDownY = 0;
}

/**
 * Метод создания скриншота
 */
function createScreenshot(argument) {
  if (IN_PROCESS === true) {
    return;
  }

  IN_PROCESS = true;
  beforeNewScreenshot();
  thumbSize = determineScreenShotSize();
  const options = {
    types: ['screen'],
    thumbnailSize: thumbSize,
  };

  commonSettings = JSON.parse(localStorage.getItem('commonSettings'));

  if (commonSettings) {
    DELAY_DURATION = commonSettings.delayNumber?commonSettings.delayNumber:1;

    if (DELAY_DURATION > 10) {
      DELAY_DURATION = 10;
    }
    if (DELAY_DURATION < 1) {
      DELAY_DURATION = 1;
    }

    DELAY_DURATION *= 1000;
  }

  const answer = ipcRenderer.sendSync('synchronous-message', 'hide');

  if (answer === 'ok') {
    setTimeout(() => {
      addScreenshot(options, thumbSize, image, ctx, stage, bitmap, body, modalOnStart, modalWindow, argument, callSave);
      IN_PROCESS = false;
    }, DELAY_DURATION);
  }
  initSettings(settings);
  initCommonSettings(settings);
  if (commonSettings) {
    if ((commonSettings.immediatelycrop || argument === 'capture') && argument !== 'fast') {
      callCrop();
    }
  }
}

/**
 * Обработчик нажатия кнопки мыши при работе с прямоугольником
 */
function stageMouseDownHandlerRect(filled, event) {
  const customEvent = (filled === 'filled') ? event : filled;

  if (filled === 'filled') {
    stage.on('stagemousemove', stageMouseMoveHandlerRect.bind(null, filled));
  } else {
      stage.on('stagemousemove', stageMouseMoveHandlerRect);
  }

  stageMouseDownHandlerDefault(filled, customEvent);
}

/**
 * Обработчик нажатия кнопки мыши при работе со стрелкой
 */
function stageMouseDownHandlerArrow(event) {
  stageMouseDownHandlerDefault(event);
  stage.on('stagemousemove', stageMouseMoveHandlerArrow);
}

/**
 * Обработчик нажатия кнопки мыши при стандартной работе с фигурой
 */
function stageMouseDownHandlerDefault(filled, event) {
  const customEvent = (filled === 'filled') ? event : filled;

  const container = new createjs.Container();

  container.name = 'shapeContainer';
  container.x = customEvent.stageX - stage.x;
  container.y = customEvent.stageY - stage.y;

  hideControls(activeShape, stage);

  if (filled === 'filled') {
    stage.addChildAt(container, 1);
  } else {
    stage.addChild(container);
  }

  stage.update();

  activeShape = container;
}

/**
 * Метод создания стрелки
 */
function drawArrow(arrow, length) {
  let penColor = shapeColorPicker.value;
  const arrowSize = Math.sqrt(length) / 1.5;
  arrow.graphics.clear().ss(4 / activeShape.scaleX).s(penColor).mt(0, 0)
    .lineTo(length, 0)
    .f(penColor)
    .dp(length - arrowSize, 0, arrowSize, 3);
  arrow.set({
    length: length,
  });
}

/**
 * Обработчик перемещения курсора мыши при работе со стрелкой
 */
function stageMouseMoveHandlerArrow(event) {
  if(activeShape === undefined) {
    return;
  }
  const arrow = new createjs.Shape();
  const shapeX = event.stageX - stage.x - activeShape.x;
  const shapeY = event.stageY - stage.y - activeShape.y;

  const length = Math.sqrt((shapeX * shapeX) + (shapeY * shapeY));

  activeShape.removeChildAt(0);

  arrow.name = 'arrow';
  drawArrow(arrow, length);
  arrow.setBounds(0, 0, shapeX, shapeY);

  activeShape.addChild(arrow);
  activeShape.rotation = (Math.atan2(shapeY, shapeX) * 180) / Math.PI;

  stage.update();

}

/**
 * Обработчик перемещения курсора мыши при работе с прямоугольником
 */
function stageMouseMoveHandlerRect(filled, event) {
  if(activeShape === undefined) {
    return;
  }

  const customEvent = (filled === 'filled') ? event : filled;
  const shape = new createjs.Shape();
  const width = Math.abs(customEvent.stageX - stage.x - activeShape.x);
  const height = Math.abs(customEvent.stageY - stage.y - activeShape.y);
  let shapeX = 0;
  let shapeY = 0;

  activeShape.removeChildAt(0);
  activeShape.removeChildAt(1);
  shape.name = 'rect';

  if (customEvent.stageX - stage.x < activeShape.x) {
    shapeX =(filled === 'filled') ? 0 : customEvent.stageX - stage.x - activeShape.x;
  }
  if (customEvent.stageY - stage.y < activeShape.y ) {
    shapeY = (filled === 'filled') ? 0 : customEvent.stageY - stage.y - activeShape.y;
  }

  if (filled === 'filled') {
    const pixeledImage = new Image();
    const canva = document.createElement('canvas');
    const canvaCtx = canva.getContext('2d');
    var borderShape = new createjs.Shape();

    borderShape.name = 'borderShape';
    canva.width = width;
    canva.height = height;
    pixeledImage.src = stage.children[0].image.src;
    canvaCtx.drawImage(pixeledImage, -activeShape.x, -activeShape.y);

    shape.graphics.beginBitmapFill(canva).drawRoundRect(shapeX, shapeY, width, height, 2 / areaZoom);
    borderShape.graphics.setStrokeStyle(1 / areaZoom).beginStroke('#37AEE2')
      .drawRoundRect(shapeX, shapeY, width, height, 2 / areaZoom);

    shape.filters = [blurFilter];
    shape.cache(shapeX, shapeY, width, height)
    shape.filled = true;
  } else {
    let penColor = shapeColorPicker.value;
    shape.graphics.setStrokeStyle(4 / areaZoom).beginStroke(penColor)
      .drawRoundRect(shapeX, shapeY, width, height, 2 / areaZoom);
  }

  shape.setBounds(shapeX, shapeY, width, height);
  activeShape.addChild(shape);

  if (borderShape) {
    activeShape.addChild(borderShape);
  }

  stage.update();

}

/**
 * Метод установки стандартных значений сцены
 */
function setDefaultSceneState() {
  setDefaultScene(stage, stageMouseDownHandler, body);
  setDefaultFrame(frame);

  // если жмём esc во время работы с фигурой
  if (onCreate === true) {
    mouseDownX = 0;
    mouseDownY = 0;
    penOldX = undefined;
    penOldY = undefined;
    stage.removeChild(activeShape);
    stage.update();
    activeShape = undefined;
    body.classList.remove('draw');
  }

  onCreate = false;
  stage.update();
}

/**
 * Вешаем обработчики для прямоугольника
 */
function callRect(filled) {
  const answer = ipcRenderer.sendSync('synchronous-message', 'rect');

  if (answer === 'ok') {
    setDefaultSceneState();
    hideControls(activeShape, stage);

    if (activeShape) {
      activeShape.removeAllEventListeners();
    }

    onCreate = true;
    body.classList.add('draw');

    if (filled === 'filled') {
      rectListeners(stageMouseDownHandlerRect.bind(null,filled), stageMouseUpShapes, stage);
    } else {
      rectListeners(stageMouseDownHandlerRect, stageMouseUpShapes, stage);
    }
  }
}

/**
 * Вешаем обработчики для стрелки
 */
function callArrow() {
  const answer = ipcRenderer.sendSync('synchronous-message', 'pen');
  if (answer === 'ok') {
    setDefaultSceneState();
    hideControls(activeShape, stage);

    if (activeShape) {
      activeShape.removeAllEventListeners();
    }

    onCreate = true;
    body.classList.add('draw');
    arrowListeners(stageMouseDownHandlerArrow, stageMouseUpShapes, stage);
  }
}

/** Draw block. Hate not pure functions( **/

/**
 * Вешаем обработчики для карандаша
 */
function callPen() {
  const answer = ipcRenderer.sendSync('synchronous-message', 'pen');

  if (answer === 'ok') {
    setDefaultSceneState();
    hideControls(activeShape, stage);
    if (activeShape) {
      activeShape.removeAllEventListeners();
    }
    onCreate = true;
    body.classList.add('draw');
    penListeners(stageMouseDownHandlerPen, stageMouseUpShapes, stage);
  }
}

/**
 * Обработчик нажатия кнопки мыши при работе с карандашом
 */
function stageMouseDownHandlerPen() {
  const shape = new createjs.Shape();

  activeShape = new createjs.Container();

  activeShape.name = 'shapeContainerPen';
  activeShape.addChild(shape);
  stage.addChild(activeShape);
  stage.on('stagemousemove', stageMouseMoveHandlerPen);
}

/**
 * Обработчик перемещения мыши при работе с карандашом
 */
function stageMouseMoveHandlerPen(event) {
  if(activeShape === undefined) {
    return;
  }
  let penColor = shapeColorPicker.value;
  fillObj = activeShape.getChildAt(0).graphics.beginStroke(penColor).command;
  let newX = event.stageX - stage.x;
  let newY = event.stageY - stage.y;
  let deltaX = Math.abs(penOldX - event.stageX - stage.x);
  let deltaY = Math.abs(penOldY - event.stageY - stage.y);
  newX = event.stageX - stage.x;
  newY = event.stageY - stage.y;

  if (penOldX) {
    if (SHIFT_PRESSED) {
      if (deltaX < deltaY) {
        newX = penOldX;
        newY = event.stageY - stage.y;
        activeShape.getChildAt(0).graphics.setStrokeStyle(penSize / areaZoom, 'round')
            .moveTo(penOldX, penOldY)
            .lineTo(penOldX, newY);
      } else {
        newX = event.stageX - stage.x;
        newY = penOldY;
        activeShape.getChildAt(0).graphics.setStrokeStyle(penSize / areaZoom, 'round')
            .moveTo(penOldX, penOldY)
            .lineTo(newX, penOldY);
      }
    } else {
      activeShape.getChildAt(0).graphics.setStrokeStyle(penSize / areaZoom, 'round')
          .moveTo(penOldX, penOldY)
          .lineTo(newX, newY);

      penOldX = newX;
      penOldY = newY;
    }

    stage.update();

  }

  if (!penOldX || SHIFT_PRESSED === false) {
    penOldX = newX;
    penOldY = newY;
  }
}

/** Crop block. Hate not pure functions( **/

/**
 * Вешаем обработчики для кропа
 */
function callCrop() {
  const answer = ipcRenderer.sendSync('synchronous-message', 'crop');

  if (answer === 'ok') {
    setDefaultSceneState();
    hideControls(activeShape, stage);
    if (activeShape) {
      activeShape.removeAllEventListeners();
    }
    onCreate = true;
    activeShape = undefined;
    cropListeners(stageMouseDownHandlerCrop, stageMouseUpHandlerCrop,
      stageMouseMoveHandlerCrop, stage, body);
  }
}

/**
 * Обработчик нажатия кнопки мыши при кропе
 *
 * @param event
 */
function stageMouseDownHandlerCrop(event) {
  mouseDownX = event.stageX;
  mouseDownY = event.stageY;

  setDefaultFrame(frame);

  frame.classList.add('show');

  frame.style.top = `${workArea.offsetTop + mouseDownY}px`;
  frame.style.left = `${workArea.offsetLeft + mouseDownX}px`;
}

/**
 * Обработчик перемещения мыши при кропе
 * @param event
 */
function stageMouseMoveHandlerCrop(event) {
  const stageX = event.stageX;
  const stageY = event.stageY;

  if (event.stageX < mouseDownX) {
    frame.style.left = `${workArea.offsetLeft + stageX}px`;
  }
  if (event.stageY < mouseDownY) {
    frame.style.top = `${workArea.offsetTop + stageY}px`;
  }

  frame.style.width = `${Math.abs(stageX - mouseDownX)}px`;
  frame.style.height = `${Math.abs(stageY - mouseDownY)}px`;
}

/**
 * Обработчик отпускания кнопки мыши при кропе
 *
 * @param event
 */
function stageMouseUpHandlerCrop(event) {
  const stageX = event.stageX;
  const stageY = event.stageY;
  let historyObj = {};

  if (mouseDownX === stageX && mouseDownY === stageY) {
    onCreate = false;
    setDefaultSceneState();
    return;
  }

  const xDemension = frame.offsetLeft - workArea.offsetLeft;
  const yDemension = frame.offsetTop - workArea.offsetTop;

  historyObj.stageX = stage.x;
  historyObj.stageY = stage.y;
  historyObj.width = workArea.width;
  historyObj.height = workArea.height;

  // удаляем тех, к кому не вернёмся если до этого было Undo
  if (historyIndex !== croppingHistory.length - 1) {
    croppingHistory.splice(historyIndex + 1, croppingHistory.length - historyIndex);
  }

  croppingHistory.pop();
  croppingHistory.push(historyObj);

  historyObj = {};

  stage.x -= xDemension;
  stage.y -= yDemension;

  workArea.width = Math.abs(stageX - mouseDownX);
  workArea.height = Math.abs(stageY - mouseDownY);

  // сохраняем обновившуюся сцену
  historyObj.stageX = stage.x;
  historyObj.stageY = stage.y;
  historyObj.width = workArea.width;
  historyObj.height = workArea.height;
  croppingHistory.push(historyObj);

  historyIndex = croppingHistory.length - 1;

  stage.update();

  onCreate = false;
  setDefaultSceneState();
  body.classList.add('centered');

}

/**
 * Работа с текстом
 */
function createText(oldEvent) {
  const textPosition = {
    x: oldEvent.stageX - stage.x,
    y: oldEvent.stageY - stage.y
  }

  let container = new createjs.Container();
  const deleteButton = createDeleteButton();
  const cimage = new Image();
  cimage.src = './images/edit.png'
  cimage.onload = () => {
    const editButton = createEditButton(cimage);
    container.name = 'shapeContainerText';

    let text = new createjs.Text('Example', '30px Roboto', '#D50000');
    text.name = 'paragraph';
    text.x = textPosition.x;
    text.y = textPosition.y;
    text.textBaseline = "alphabetic";

    container.addChild(text)
    deleteButton.addEventListener('click', deleteShape);
    deleteButton.x = text.x - 25;
    deleteButton.y = text.y - 30;
    container.addChild(deleteButton);

    editButton.addEventListener('click', openTextSidebar);

    editButton.x = text.x - 25;
    editButton.y = text.y;
    container.addChild(editButton);

    stage.addChild(container);
    activeShape = container;
    stage.update();
    body.classList.remove('text');
    openTextSidebar();

  }
}

/**
 * Инициализация модалки при открытии
 * @return {[type]}
 */
function openTextSidebar() {
  const paragraph = activeShape.children[0];
  textateaFontSize.value = paragraph.font.split('px')[0];
  textareaContent.value = paragraph.text;
  textateaFontColor.value = activeShape.children[0].color;
  textSidebar.classList.add('show');
  if (!textSidebar.classList.contains('show')) {
    hideControls(activeShape, stage);
    activeShape = undefined;
  }
}

/**
 * Перемещаемся назад в истории кропа
 */
function undoCrop() {
  const index = historyIndex - 1;

  const undoObj = croppingHistory[index];

  if (undoObj === undefined) {
    return;
  }

  stage.x = undoObj.stageX;
  stage.y = undoObj.stageY;

  workArea.width = undoObj.width;
  workArea.height = undoObj.height;

  stage.update();

  historyIndex = index;

  if (historyIndex === 0) {
    body.classList.remove('centered');
  }

}

function beforeNewScreenshot() {
  setDefaultSceneState();
  stage.x = 0;
  stage.y = 0;
  croppingHistory = [];
}

/**
 * Перемещаемся вперёд в истории кропа
 */
function redoCrop() {
  const index = historyIndex + 1;
  const redoObj = croppingHistory[index];

  if (redoObj === undefined) {
    return;
  }

  stage.x = redoObj.stageX;
  stage.y = redoObj.stageY;

  workArea.width = redoObj.width;
  workArea.height = redoObj.height;

  stage.update();


  historyIndex = index;

  body.classList.add('centered');
}

/**
 * Getter для получения значения фалага
 */
function getDrawStatus() {
  return onCreate;
}

/**
 * Zoom in handler
 */
function callZoomIn() {
  if (areaZoom < MAX_ZOOM) {
    areaZoom += 0.1;
    body.style.transform = `scale(${areaZoom})`;
  }
}

/**
 * Zoom out handler
 */
function callZoomOut() {
  if (areaZoom > MIN_ZOOM) {
    areaZoom -= 0.1;
    body.style.transform = `scale(${areaZoom})`;
  }
}

/**
 * Set default zoom handler
 */
function setDefaultZoom() {
  areaZoom = 1;
  body.style.transform = `scale(${areaZoom})`;
}

function createEmoji(type) {
  const emojiImage = new Image();
  const container = new createjs.Container();

  container.name = 'shapeContainer';
  emojiImage.src = `./images/emoji/${type}.png`

  emojiImage.onload = () => {
    const deleteButton = createDeleteButton();
    const transformButton = createTransformButton();
    const emoji = new createjs.Bitmap(emojiImage);

    emoji.name = 'emoji';
    emoji.scaleX = emoji.scaleY = 0.35;
    container.addChild(emoji);

    addOutline(container);

    deleteButton.addEventListener('click', deleteShape);
    deleteButton.x = -10;
    deleteButton.y = -10;
    container.addChild(deleteButton);

    transformButton.x = container.getBounds().width + (10 / container.scaleX);
    transformButton.y = container.getBounds().height + (10 / container.scaleX);
    transformButton.addEventListener('mousedown', transformPressHandler);
    transformButton.addEventListener('pressmove', transformMoveHandler);
    transformButton.addEventListener('pressup', transformUpHandler);

    container.addChild(transformButton);

    if (croppingHistory.length === 0) {
      container.x = (workArea.width / 2) - 128;
      container.y = (workArea.height / 2) - 128;
    } else {
      container.x = (workArea.width / 2) - 128 - croppingHistory[historyIndex].stageX;
      container.y = (workArea.height / 2) - 128 - croppingHistory[historyIndex].stageY;
    }

    stage.addChild(container);
    hideControls(container, stage);
    stage.update();
  };
}

/**
 * Обработчик сохранения результата
 */
function callSave(flag) {
  if (loader.classList.contains('show')) {
    return;
  }

  let data;
  const time = new Date();
  let settings = getSettings();
  const homePath = process.env.HOME || process.env.USERPROFILE;
  const screenshotPath = path.join(`${homePath}/.--shots`, `${Date.now()}.png`);
  let screenshotPathTemp = path.join(`${homePath}/.--shots`, `clip.board.png`);
  let imageBuffer;
  let difference;
  let answerOffline;

  if (!fs.existsSync(`${homePath}/.--shots`)) {
    fs.mkdirSync(`${homePath}/.--shots`);
  }

  hideControls(activeShape, stage);
  activeShape = undefined;

  loader.style.transform = `scale(${1 / areaZoom})`;
  loader.classList.add('show');
  loaderText.textContent = 'Saving';
  workArea.style.transform = `scale(${1 / areaZoom})`;
  data = workArea.toDataURL('', 'image/png');
  workArea.style.transform = '';
  ipcRenderer.sendSync('synchronous-message', 'optimize', data);

  if (oldBase !== data) {
    oldBase = data;
  }

  setDefaultSceneState();

  if (flag !== undefined) {
    settings = flag;
  }

  isOnline((err, status) => {
    if (status !== true) {
      if (['local base64', 'local', 'base64'].indexOf(settings) === -1) {
        settings = 'offline';
      }
    } });

    switch (settings) {
      case 'offline':
        answerOffline = confirm("You're offline now. Are you agree to save a screenshot locally?");
        if (answerOffline) {
          data = data.replace(/\s+/g, '');
          imageBuffer = decodeBase64Image(data);
          ipc.send('open-save-dialog', imageBuffer.data, localStorage.getItem('savePath'));
        } else {
          hideLoader(difference, 'Stopping', loaderText);
        }
        break;

      case 'local':
        data = data.replace(/\s+/g, '');
        imageBuffer = decodeBase64Image(data);
        ipc.send('open-save-dialog', imageBuffer.data, localStorage.getItem('savePath'));
        break;

      case 'base64':
        data = data.replace(/\s+/g, '');
        imageBuffer = decodeBase64Image(data);
        fs.writeFile(screenshotPathTemp, imageBuffer.data, function(){
          let imagePath = path.join(`${homePath}`, '/.--shots/clip.board.png');
          let image = nativeImage.createFromPath(imagePath);
          clipboard.writeImage(imagePath);
          fs.unlinkSync(imagePath);
        });


        difference = Math.abs(new Date() - time);
        hideLoader(difference, 'Copied to buffer', loaderText);
        break;

      case 'server link':
        sendToServer(data, time, loader, loaderText);
        break;

      case 'facebook':
        sendToServer(data, time, loader, loaderText, ()=> {
          sendToSocialNetwork('facebook');
        }, 'Facebook');
        break;

      case 'twitter':
        sendToServer(data, time, loader, loaderText, ()=> {
            sendToSocialNetwork('twitter');
        }, 'Twitter');
        break;

      case 'vkontakte':
        sendToServer(data, time, loader, loaderText, ()=> {
          sendToSocialNetwork('vkontakte');
        }, 'VKontakte');
        break;

      case 'local base64':
        data = data.replace(/\s+/g, '');
        imageBuffer = decodeBase64Image(data);
        fs.writeFile(screenshotPathTemp, imageBuffer.data, function(){
          let imagePath = path.join(`${homePath}`, '/.--shots/clip.board.png');
          let image = nativeImage.createFromPath(imagePath);
          clipboard.writeImage(imagePath);
          fs.unlinkSync(imagePath);
          ipc.send('open-save-dialog', imageBuffer.data, localStorage.getItem('savePath'));
        });
        break;

      default:
        sendToServer(data, time, loader, loaderText);
        break;
    }
}

/**
 * Вызываем метод сохранения и формируем ссылку для нужной соц сети
 */
function callSendToSocialNetwork(type) {
  callSave(type)
}

ipc.on('successSave', (event, path)=>{
  hideLoader(3000, `Saved at "${path}"`, loaderText);
  localStorage.setItem('savePath', path.substr(0, path.lastIndexOf('/')));
});

ipc.on('canceledSave', (event)=>{
  hideLoader(3000, 'Stopping', loaderText);
});

ipc.on('saveState', (event)=>{
  if (workArea.toDataURL('', 'image/png') === oldBase) {
    ipcRenderer.sendSync('synchronous-message', 'createNew', 'dontask');
  } else {
    ipcRenderer.sendSync('synchronous-message', 'createNew', 'ask');
  }
});

ipc.on('facebook', (event) => {
  callSendToSocialNetwork('facebook')
})
ipc.on('twitter', (event) => {
  callSendToSocialNetwork('twitter')
})
ipc.on('vkontakte', (event) => {
  callSendToSocialNetwork('vkontakte')
})

ipc.on('isDropbox', (event) => {
  let dbToken = localStorage.getItem('dropboxToken');
  ipcRenderer.sendSync('synchronous-message', 'dropbox-token', dbToken);
});

ipc.on('isImgur', (event) => {
  let dbToken = localStorage.getItem('imgurToken');
  ipcRenderer.sendSync('synchronous-message', 'imgur-token', dbToken);
});

ipc.on('freshDropboxToken', (event, data) => {
  let token = data.split('access_token=')[1];
  token = token.split('&token_type=')[0];
  localStorage.setItem('dropboxToken', token);
});

ipc.on('freshImgurToken', (event, data) => {
  let token = data.split('access_token=')[1];
  token = token.split('&expires_in')[0];
  localStorage.setItem('imgurToken', token);
});

ipc.on('saveImgur', (event) => {
  isOnline((err, status) => {
    if (status !== true) {
      popUp(popupWindow, popupText, `You're offline now. Try again later.`);
    } });

    const time = new Date();

    let imToken = localStorage.getItem('imgurToken');
    hideControls(activeShape, stage);
    activeShape = undefined;
    setDefaultSceneState();

    if (imToken === null || imToken === undefined) {
      popUp(popupWindow, popupText, 'Sign in to Imgur (Sign in to > Imgur)');
      return;
    }

    loader.style.transform = `scale(${1 / areaZoom})`;
    loader.classList.add('show');
    loaderText.textContent = 'In process';

    let imageSringData = workArea.toDataURL('', 'image/png');
    //Convert it to an arraybuffer
    let timestamp = new Date().getTime();
    let difference;
    const imgUrl = "http://i.imgur.com/l5OqYoZ.jpg";
    let xhr = new XMLHttpRequest();
    let pathToServer = 'https://api.imgur.com/3/upload';

    let imageData = imageSringData.replace('data:image/png;base64,', '');

    xhr.open('POST', pathToServer, true);
    xhr.setRequestHeader("Authorization", "Bearer " + imToken);
    xhr.setRequestHeader('Content-Type', 'json');
    let sendingData = {
      image: imageData,
      type: 'base64'
    };
    xhr.send(JSON.stringify(sendingData));
    xhr.onload = () => {
    	let resp = JSON.parse(xhr.responseText);
      switch (resp.status) {
        case 500:
          difference = Math.abs(new Date() - time);
          hideLoader(difference, 'Server error😱', loaderText);
          break;

        case 400:
          difference = Math.abs(new Date() - time);
          hideLoader(difference, 'An impossible request 😱', loaderText);
          break;

        case 401:
          difference = Math.abs(new Date() - time);
          hideLoader(difference, 'Auth error 😱', loaderText);
          break;

        case 200:
          if (xhr) {
            let link = resp.data.link;
            clipboard.writeText(link);
            difference = Math.abs(new Date() - time);
            hideLoader(difference, 'Saved to Imgur and copied to clipboard', loaderText);
          }

          break;

        default:
          difference = Math.abs(new Date() - time);
          hideLoader(difference, 'Unknown error 😱', loaderText);
          break;
      }
    }
});

ipc.on('saveDropbox', (event) => {
  isOnline((err, status) => {
    if (status !== true) {
      popUp(popupWindow, popupText, `You're offline now. Try again later.`);
    } });

  const time = new Date();

  let dbToken = localStorage.getItem('dropboxToken');
  hideControls(activeShape, stage);
  activeShape = undefined;
  setDefaultSceneState();

  if (dbToken === null || dbToken === undefined) {
    popUp(popupWindow, popupText, 'Sign in to Dropbox (Sign in to > Dropbox)');
    return;
  }

  loader.style.transform = `scale(${1 / areaZoom})`;
  loader.classList.add('show');
  loaderText.textContent = 'In process';

  let dbx = new Dropbox({ accessToken: dbToken });
  let imageSringData = workArea.toDataURL('', 'image/png');
  //Convert it to an arraybuffer
  let imageData = _base64ToArrayBuffer(imageSringData);
  let timestamp = new Date().getTime();
  let difference;

  dbx.filesUpload({path: '/' + `${timestamp}.png`, contents: imageData})
     .then(function(response) {
       difference = Math.abs(new Date() - time);
       hideLoader(difference, 'Saved to Dropbox', loaderText);
       //popUp(popupWindow, popupText, 'Saved to Dropbox');
     })
     .catch(function(error) {
       difference = Math.abs(new Date() - time);
       hideLoader(difference, 'Something wrong. If you previously unlink app, please auth again.', loaderText);
     });
});

function _base64ToArrayBuffer(base64) {
    base64 = base64.split('data:image/png;base64,').join('');
    var binary_string =  window.atob(base64),
        len = binary_string.length,
        bytes = new Uint8Array( len ),
        i;

    for (i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Обработчик нажатия на чекбокс применения кастомных настроек.
 */
function applyCustomSettingsButtonChangeHandler(event) {
  setFieldsetStatus(settingFieldsets, !event.target.checked);
}

function addOutline(emoji) {
  const frame = new createjs.Shape();
  const hitArea = new createjs.Shape();
  const bounds = emoji.getBounds();
  const width = bounds.width;
  const height = bounds.height;

  hitArea.graphics
    .setStrokeStyle(1)
    .beginStroke('#F00')
    .beginFill('black')
    .drawRect(-width / 2, -height / 2, width, height);

  frame.hitArea = hitArea;

  frame.graphics.setStrokeStyle(1).beginStroke('#37aee2')
    .drawRect(0, 0, width, height);

  frame.setBounds(0, 0, width, height);

  frame.name = 'outline';
  emoji.addChild(frame);
}
