const CLOSE = 'close';
const MAX_ZOOM = 2;
const MIN_ZOOM = .5;
const MINIMUM_TIMER = 2000;
// работа с меню
const Menu = require('./menu');
// создание скриншота
const addScreenshot = require('./functions/addScreenshot');
const electron = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isOnline = require('is-online');
const {
    ipcRenderer
} = require('electron');
const ipc = require('electron').ipcRenderer;
const ipcAdd = require('./ipc/ipcAdd');
const determineScreenShotSize = require('./functions/determineScreenShotSize');
const {
    clipboard
} = require('electron');
//Позиция по X, куда пришлось нажатие кнопки мыши
let mouseDownX;
// Позиция по Y, куда пришлось нажатие кнопки мыши
let mouseDownY;
// Рамка, которая указывает на область кропа
let frame = document.getElementById('frame');
let loader = document.getElementById('loader');
let loaderText = loader.querySelector('span');
let shortcutWindow = document.querySelector('.shortcut');
let settings = document.querySelector('aside.settings');
let applyCustomSettingsButton = settings.querySelector('#applyCustom');
let settingFieldsets = settings.querySelectorAll('fieldset');
const setDefaultFrame = require('./functions/setDefaultFrame');
// сам canvas
const workArea = document.querySelector('canvas');
// определяем сцену для работы с easel
const stage = new createjs.Stage("stage");
// определяем контекст канваса
let ctx = workArea.getContext('2d');
// создаём img для добавления на канвас
let image = new Image();
// битмап для изображения
let bitmap;
// размеры окна
let thumbSize;
// Body-element
const body = document.body;
// обработчик нажатия на кнопки закрытия в модальном окне
const closeModalButtonClickHandler = require('./functions/closeModal');
// цвет карандаша
const penColor = "#D50000";
// толщина карандаша
const penSize = 4;
const addModalButtonListeners = require('./functions/addModalButtonListeners');
const createDeleteButton = require('./functions/createDeleteButton');
const createTransformButton = require('./functions/createTransformButton');
const hideControls = require('./functions/hideControls');
const showControls = require('./functions/showControls');
const cropListeners = require('./functions/cropListeners');
const penListeners = require('./functions/penListeners');
const rectListeners = require('./functions/rectListeners');
const arrowListeners = require('./functions/arrowListeners');
const setDefaultScene = require('./functions/setDefaultScene');
const getCookie = require('./functions/getCookieByName');
const modalOnStart = require('./functions/modalOnStart');
const setTransformRectDistance = require('./functions/setTransformRectDistance');
const getDegree = require('./functions/getDegree');
const initSettings = require('./functions/initSettings');
const initCommonSettings = require('./functions/initCommonSettings');
const setFieldsetStatus = require('./functions/setFieldsetStatus');
const sendToServer = require('./functions/sendToServer');
const getSettings = require('./functions/getSettings');
const decodeBase64Image = require('./functions/decodeBase64Image');
const hideLoader = require('./functions/hideLoader');
const serverMessage = require('./functions/serverMessage');
const serverButtonClickHandler = require('./functions/serverButtonClickHandler');
var fillObj;
// Массив объектов, содержащих данные о каждом кропе.
let croppingHistory = [];
// Индекс текущего кусочка истории в массива
let historyIndex = 0;
// Текущая активная фигура
let activeShape = undefined;
// модальное окно с подсказкой
const modalWindow = document.querySelector('body>aside.hint');
// кнопки закрытия модального окна
const closeModalButtons = modalWindow.querySelectorAll('button');
const closeShortcutButtons = shortcutWindow.querySelectorAll('button');
const closeSettingsButtons = settings.querySelectorAll('button.close');
const serverButton = settings.querySelector('button#serverPath');
// старое значение по X при работе с карандашом
let penOldX;
// старое значение по Y при работе с карандашом
let penOldY;
// флаг, указывающий на процесс работы с инструментом
let onCreate = false;
let areaZoom = 1;
let scale;

// на случай говна
serverMessage();
stage.enableDOMEvents(true);
addModalButtonListeners(closeModalButtons, closeModalButtonClickHandler, body,
    modalWindow);
addModalButtonListeners(closeShortcutButtons, closeModalButtonClickHandler, body,
    shortcutWindow);
addModalButtonListeners(closeSettingsButtons, closeModalButtonClickHandler, body,
    settings);
applyCustomSettingsButton.addEventListener('change', applyCustomSettingsButtonChangeHandler, false);
serverButton.addEventListener('click', serverButtonClickHandler, false);
// обработчик клика по сцене
stage.addEventListener('mousedown', stageMouseDownHandler)
    // Создаём меню приложения
Menu(
    stage, stageMouseDownHandlerCrop, stageMouseUpHandlerCrop,
    stageMouseMoveHandlerCrop, openNewScreenshotDialog, callCrop,
    callRect, callPen, callArrow, callSave);

ipcAdd(undoCrop, redoCrop, setDefaultSceneState, createScreenshot, callCrop,
    callRect, callPen, body, modalWindow, getDrawStatus, callZoomIn, callZoomOut,
    setDefaultZoom, callArrow, callSave, shortcutWindow, settings);
// Метод вызова диалога о создании нового скриншота
function openNewScreenshotDialog() {
    ipc.send('open-information-dialog');
}
initSettings(settings);
initCommonSettings(settings);
// Делаем скриншот после первой инициализации
createScreenshot();

/**
 * Обработчик нажатия на сцене для выбора элементов
 */
function stageMouseDownHandler(event) {
    let target = event.target;
    let name = target.parent.name;
    // закрытие модалки по чёрному пространству вокруг
    if (name === null && body.classList.contains('modal')) {
        modalWindow.classList.remove('open');
        shortcutWindow.classList.remove('open');
        settings.classList.remove('open');
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
                    let demensionX = activeShape.x - event.stageX;
                    let demensionY = activeShape.y - event.stageY;

                    if (name.indexOf('Pen') === -1 && onCreate === false) {
                        activeShape.on("pressmove", function(event) {
                            body.classList.add('move');

                            activeShape.x = event.stageX + demensionX;
                            activeShape.y = event.stageY + demensionY;
                            stage.update();
                        });

                        activeShape.on("pressup", function(event) {
                            body.classList.remove('move');
                        })
                    }
                }
            }
        } else if (name === null && activeShape !== undefined) {
            hideControls(activeShape, stage);
            activeShape = undefined;
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

    hideControls(activeShape, stage);
    stage.removeChild(activeShape);
    activeShape = undefined;
    stage.update();
}

/**
 * Обработчик отпускания клавиши мыши при работе с фигурами
 */
function stageMouseUpShapes(event) {
    let deleteButton = createDeleteButton();

    onCreate = false;

    deleteButton.addEventListener('click', deleteShape);

    if (penOldX !== undefined && penOldY !== undefined) {
        deleteButton.x = penOldX - 10;
        deleteButton.y = penOldY - 10;
    } else {
        var transformButton = createTransformButton();
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
        transformButton.addEventListener('mousedown', transformPressHandler)
        transformButton.addEventListener('pressmove', transformMoveHandler);
        transformButton.addEventListener('pressup', transformUpHandler);
    }

    let arrow = activeShape.getChildByName('arrow');

    if (arrow !== null) {
        transformButton.x = arrow.length + 25;
        transformButton.y = 10;
    }

    activeShape.addChild(deleteButton);
    activeShape.addChild(transformButton);

    hideControls(activeShape, stage);

    penOldX = undefined;
    penOldY = undefined;
    activeShape = undefined;
    setDefaultSceneState();
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
    let child = activeShape.children;
    let distance1;
    let distance2;
    let result;
    let arrow = activeShape.getChildByName('arrow');
    result =
        setTransformRectDistance(event.stageX, event.stageY, croppingHistory,
            historyIndex, activeShape, mouseDownX, mouseDownY);
    distance1 = result.distance1;
    distance2 = result.distance2;

    activeShape.scaleX = activeShape.scaleY =
        distance2 / distance1 * scale;


    for (i = 0, n = activeShape.children.length; i < n; i++) {
        if ((child[i].name === 'transform')) {
            child[i].scaleX = child[i].scaleY = 1 / activeShape.scaleX;
            if (arrow !== null) {
                child[i].x = arrow.length + 25 / activeShape.scaleX;
                child[i].y = 10 / activeShape.scaleX;
            } else {
                child[i].x = activeShape.getBounds().width + 10 / activeShape.scaleX;
                child[i].y = activeShape.getBounds().height + 10 / activeShape.scaleX;
            }
        }

        if ((child[i].name === 'close')) {
            let rect = activeShape.getChildByName('rect');
            if (rect === null) {
                rect = activeShape.getChildByName('arrow');
            }
            child[i].scaleX = child[i].scaleY = 1 / activeShape.scaleX;
            child[i].x = rect.x - 10 / activeShape.scaleX;
            child[i].y = rect.y - 10 / activeShape.scaleX;
        }

        if ((child[i].name === 'rect')) {
            let width = child[i].getBounds().width;
            let height = child[i].getBounds().height;
            let top = child[i].y;
            let left = child[i].x;

            child[i].graphics.clear().setStrokeStyle(4 / activeShape.scaleX).beginStroke("#D50000").drawRoundRect(left, top, width, height, 2 / activeShape.scaleX);
        }
        if ((child[i].name === 'arrow')) {
            drawArrow(child[i], child[i].length)
        }
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
function createScreenshot() {
    beforeNewScreenshot();
    thumbSize = determineScreenShotSize();
    let options = {
        types: ['screen'],
        thumbnailSize: thumbSize
    };

    let answer = ipcRenderer.sendSync('synchronous-message', 'hide');
    if (answer === 'ok') {
        setTimeout(() => {
            addScreenshot(options, thumbSize, image, ctx, stage, bitmap)
        }, 100);
    }

    image = new Image();
    stage.update();
    modalOnStart(body, modalWindow);
}

/**
 * Обработчик нажатия кнопки мыши при работе с прямоугольником
 */
function stageMouseDownHandlerRect(event) {
    let container = new createjs.Container();

    container.name = 'shapeContainer';
    container.x = event.stageX - stage.x;
    container.y = event.stageY - stage.y;

    hideControls(activeShape, stage);

    stage.addChild(container);

    stage.update();

    activeShape = container;

    stage.on("stagemousemove", stageMouseMoveHandlerRect);
}

/**
 * Обработчик нажатия кнопки мыши при работе со стрелкой
 */
function stageMouseDownHandlerArrow(event) {
    let container = new createjs.Container();

    container.name = 'shapeContainer';
    container.x = event.stageX - stage.x;
    container.y = event.stageY - stage.y;

    hideControls(activeShape, stage);

    stage.addChild(container);

    stage.update();

    activeShape = container;

    stage.on("stagemousemove", stageMouseMoveHandlerArrow);
}

/**
 * Метод создания стрелки
 */
function drawArrow(arrow, length) {
    let arrowSize = Math.sqrt(length) / 1.5;
    arrow.graphics.clear().ss(4 / activeShape.scaleX).s("#D50000").mt(0, 0).lineTo(length, 0).f("#D50000")
        .dp(length - arrowSize, 0, arrowSize, 3);
    arrow.set({
        length: length
    });
}

/**
 * Обработчик перемещения курсора мыши при работе со стрелкой
 */
function stageMouseMoveHandlerArrow(event) {
    let arrow = new createjs.Shape();
    let shapeX = event.stageX - stage.x - activeShape.x;
    let shapeY = event.stageY - stage.y - activeShape.y;

    let length = Math.sqrt(shapeX * shapeX + shapeY * shapeY);

    activeShape.removeChildAt(0);

    arrow.name = 'arrow';
    drawArrow(arrow, length);
    arrow.setBounds(0, 0, shapeX, shapeY);

    activeShape.addChild(arrow);
    activeShape.rotation = Math.atan2(shapeY, shapeX) * 180 / Math.PI;

    stage.update();
}

/**
 * Обработчик перемещения курсора мыши при работе с прямоугольником
 */
function stageMouseMoveHandlerRect(event) {
    let shape = new createjs.Shape();
    let width = Math.abs(event.stageX - stage.x - activeShape.x);
    let height = Math.abs(event.stageY - stage.y - activeShape.y);
    let shapeX = 0;
    let shapeY = 0;

    activeShape.removeChildAt(0);
    shape.name = 'rect';

    if (event.stageX - stage.x < activeShape.x) {
        shapeX = event.stageX - stage.x - activeShape.x;
    }
    if (event.stageY - stage.y < activeShape.y) {
        shapeY = event.stageY - stage.y - activeShape.y;
    }

    shape.graphics.setStrokeStyle(4 / areaZoom).beginStroke("#D50000").drawRoundRect(shapeX, shapeY, width, height, 2 / areaZoom);
    shape.setBounds(shapeX, shapeY, width, height);
    activeShape.addChild(shape);

    stage.update();
}

/**
 * Метод установки стандартных значений сцены
 */
function setDefaultSceneState() {
    setDefaultScene(stage, stageMouseDownHandler, body);
    setDefaultFrame(frame);

    // если жмём esc во время работы с фигурой
    // добавить условие про crop
    if (onCreate === true) {
        mouseDownX = 0;
        mouseDownY = 0;
        penOldX = undefined;
        penOldY = undefined;
        stage.removeChild(activeShape);
        stage.update();
        activeShape = undefined;
    }

    onCreate = false;
    stage.update();
}

/**
 * Вешаем обработчики для прямоугольника
 */
function callRect() {
    const answer = ipcRenderer.sendSync('synchronous-message', 'rect');

    if (answer === 'ok') {
        setDefaultSceneState();
        hideControls(activeShape, stage);

        if (activeShape) {
            activeShape.removeAllEventListeners();
        }

        onCreate = true;
        rectListeners(stageMouseDownHandlerRect, stageMouseUpShapes, stage);
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
        arrowListeners(stageMouseDownHandlerArrow, stageMouseUpShapes, stage);
    }
}

/**Draw block. Hate not pure functions( **/

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
        penListeners(stageMouseDownHandlerPen, stageMouseUpShapes, stage);
    }
}

/**
 * Обработчик нажатия кнопки мыши при работе с карандашом
 */
function stageMouseDownHandlerPen() {
    let shape = new createjs.Shape();

    activeShape = new createjs.Container();

    activeShape.name = 'shapeContainerPen';
    activeShape.addChild(shape);
    stage.addChild(activeShape);
    stage.on("stagemousemove", stageMouseMoveHandlerPen);
}

/**
 * Обработчик перемещения мыши при работе с карандашом
 */
function stageMouseMoveHandlerPen(event) {
    fillObj = activeShape.getChildAt(0).graphics.beginStroke(penColor).command;
    if (penOldX) {
        activeShape.getChildAt(0).graphics.setStrokeStyle(penSize / areaZoom, "round")
            .moveTo(penOldX, penOldY)
            .lineTo(event.stageX - stage.x, event.stageY - stage.y);
        stage.update();
    }

    penOldX = event.stageX - stage.x;
    penOldY = event.stageY - stage.y;
}

/******************************************/

/**Crop block. Hate not pure functions( **/

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
        cropListeners(stageMouseDownHandlerCrop, stageMouseUpHandlerCrop, stageMouseMoveHandlerCrop, stage, body);
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

    frame.style.top = (workArea.offsetTop + mouseDownY) + 'px';
    frame.style.left = (workArea.offsetLeft + mouseDownX) + 'px';
}

/**
 * Обработчик перемещения мыши при кропе
 * @param event
 */
function stageMouseMoveHandlerCrop(event) {
    const stageX = event.stageX;
    const stageY = event.stageY;
    const bound = workArea.getBoundingClientRect();

    if (event.stageX < mouseDownX) {
        frame.style.left = workArea.offsetLeft + stageX + 'px';
    }
    if (event.stageY < mouseDownY) {
        frame.style.top = workArea.offsetTop + stageY + 'px';
    }

    frame.style.width = Math.abs(stageX - mouseDownX) + 'px';
    frame.style.height = Math.abs(stageY - mouseDownY) + 'px';
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

    let xDemension = frame.offsetLeft - workArea.offsetLeft;
    let yDemension = frame.offsetTop - workArea.offsetTop;

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

    stage.x = stage.x - xDemension;
    stage.y = stage.y - yDemension;

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
}

/**
 * Перемещаемся назад в истории кропа
 */
function undoCrop() {
    let index = historyIndex - 1;

    let undoObj = croppingHistory[index];

    if (undoObj === undefined) {
        return;
    }

    stage.x = undoObj.stageX;
    stage.y = undoObj.stageY;

    workArea.width = undoObj.width;
    workArea.height = undoObj.height;

    stage.update();

    historyIndex = index;
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

    let index = historyIndex + 1;

    let redoObj = croppingHistory[index];

    if (redoObj === undefined) {
        return;
    }

    stage.x = redoObj.stageX;
    stage.y = redoObj.stageY;

    workArea.width = redoObj.width;
    workArea.height = redoObj.height;

    stage.update();

    historyIndex = index;
}
/*********************************************/

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
        areaZoom += .1;
        body.style.transform = `scale(${areaZoom})`;
    }
}

/**
 * Zoom out handler
 */
function callZoomOut() {
    if (areaZoom > MIN_ZOOM) {
        areaZoom -= .1;
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

/**
 * Обработчик сохранения результата
 */
function callSave() {

    if (loader.classList.contains('show')) {
      return;
    }

    let img = new Image();
    let data;
    let answer;
    let time = new Date();
    let settings = getSettings();
    let homePath = process.env.HOME || process.env.USERPROFILE;
    let screenshotPath = path.join(`${homePath}/--shots`, `${Date.now()}.png`);
    let imageBuffer;
    let difference;
    let answerOffline;

    if (!fs.existsSync(`${homePath}/--shots`)) {
        fs.mkdirSync(`${homePath}/--shots`);
    }

    hideControls(activeShape, stage);
    activeShape = undefined;

    loader.style.transform = `scale(${1/areaZoom})`;
    loader.classList.add('show');
    loaderText.textContent = 'Saving';
    workArea.style.transform = `scale(${1/areaZoom})`;
    data = workArea.toDataURL('', 'image/jpeg');
    workArea.style.transform = '';
    answer = ipcRenderer.sendSync('synchronous-message', 'optimize', data);

    isOnline(function(err, isOnline) {
        if (isOnline !== true) {
            if (['local base64', 'local', 'base64'].indexOf(settings) === -1) {
                settings = 'offline';
            }
        }

        switch (settings) {
            case 'offline':
                answerOffline = confirm("You're offline now. Are you agree to save a screenshot locally?");
                if (answerOffline) {
                    data = data.replace(/\s+/g, '');
                    imageBuffer = decodeBase64Image(data);
                    fs.writeFile(screenshotPath, imageBuffer.data);

                    difference = Math.abs(new Date() - time);
                    hideLoader(difference, `Saved at "${homePath}/--shots"`, loaderText);
                } else {
                    hideLoader(difference, `Stopping`, loaderText);
                }
                break;
            case 'local':
                data = data.replace(/\s+/g, '');
                imageBuffer = decodeBase64Image(data);
                fs.writeFile(screenshotPath, imageBuffer.data);

                difference = Math.abs(new Date() - time);
                hideLoader(difference, `Saved at "${homePath}/--shots"`, loaderText);
                break;

            case 'base64':
                data = data.replace(/\s+/g, '');
                clipboard.writeText(data);

                difference = Math.abs(new Date() - time);
                hideLoader(difference, `Copied to buffer`, loaderText);
                break;

            case 'server link':
                sendToServer(data, time, loader, loaderText);
                break;

            case 'local base64':
                data = data.replace(/\s+/g, '');
                clipboard.writeText(data);
                imageBuffer = decodeBase64Image(data);
                fs.writeFile(screenshotPath, imageBuffer.data);

                difference = Math.abs(new Date() - time);
                hideLoader(difference, `Saved at "${homePath}/--shots" an copied to buffer`, loaderText);
                break;

            case 'server local link':
                data = data.replace(/\s+/g, '');
                imageBuffer = decodeBase64Image(data);
                fs.writeFile(screenshotPath, imageBuffer.data);
                sendToServer(data, time, loader, loaderText, `${homePath}/--shots`);
                break;
            default:
                sendToServer(data, time, loader, loaderText);
                break;
        }
    });
}

/**
 * Обработчик нажатия на чекбокс применения кастомных настроек.
 */
function applyCustomSettingsButtonChangeHandler(event) {
    setFieldsetStatus(settingFieldsets, !event.target.checked);
}
