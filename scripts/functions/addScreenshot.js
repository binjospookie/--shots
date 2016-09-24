const electron = require('electron');
const desktopCapturer = electron.desktopCapturer;
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
    ipcRenderer
} = require('electron');

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
module.exports = function addScreenshot(options, thumbSize, image, ctx, stage, bitmap) {
    desktopCapturer.getSources(options, function(error, sources) {
        sources.forEach(function(source) {
            if (source.name === 'Entire screen' || source.name === 'Screen 1') {
                screenshotPath = path.join(os.tmpdir(), 'screenshot.png');
                fs.writeFile(screenshotPath, source.thumbnail.toPng(), () => {
                    image.src = screenshotPath;
                    image.onload = () => {
                        ctx.canvas.width = image.width;
                        ctx.canvas.height = image.height;

                        bitmap = new createjs.Bitmap(image);
                        stage.addChild(bitmap);
                        stage.update();

                        ipcRenderer.send('synchronous-message', thumbSize);
                    };
                });
            }
        })
    })
};
