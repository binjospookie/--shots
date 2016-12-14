const electron = require('electron');
const desktopCapturer = electron.desktopCapturer;
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
    ipcRenderer
} = require('electron');
let screenshotPath = '';
const commonSettings = localStorage.getItem('commonSettings');
let array = [];

if (commonSettings !== null) {
  array = JSON.parse(commonSettings);
}

/**
 * Создание скриншота, добавление на канвас и изменение размеров окна
 *
 * @param options
 * @param thumbSize
 * @param image
 * @param ctx
 * @param stage
 * @param bitmap
 */
module.exports = function addScreenshot(options, thumbSize, image, ctx, stage, bitmap, body, modalOnStart, modalWindow, argument, callSave) {
  const time = new Date().getTime() / 1000;
  const cursourPos = electron.screen.getCursorScreenPoint();

  desktopCapturer.getSources(options, (error, sources) => {
    sources.forEach((source) => {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        screenshotPath = path.join(os.tmpdir(), `${time}.png`);
        fs.writeFile(screenshotPath, source.thumbnail.toPng(), () => {
          image.src = screenshotPath;
          image.onload = () => {
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;

            stage.removeAllChildren();
            stage.update();

            bitmap = new createjs.Bitmap(image);

            if (array.indexOf('capture') !== -1) {
              const cimage = new Image();
              cimage.src = './images/cursor.png'
              cimage.onload = () => {
                addCursor(cimage, stage, cursourPos);
              }
            }

            stage.addChild(bitmap);
            stage.update();

            ipcRenderer.send('synchronous-message', thumbSize);
            fs.unlinkSync(screenshotPath);
            image = null;
            screenshotPath = '';
            
            stage.update();
            body.classList.remove('centered');
            modalOnStart(body, modalWindow);
            if(argument === 'fast') {
              callSave();
            }
          };
        });
      }
    });
  });
};

function addCursor(image, stage, cursourPos) {
  const cursor = new createjs.Bitmap(image);
  cursor.name = 'cursor';
  cursor.x = cursourPos.x;
  cursor.y = cursourPos.y;
  stage.addChild(cursor);
  stage.update();
}
