const electron = require('electron');
const electronScreen = electron.screen;
/**
 * Получение размеров окна для скриншота и размеров окна приложения
 * @returns {{width: number, height: number}}
 */
module.exports = function determineScreenShotSize() {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
    return {
        width: screenSize.width * window.devicePixelRatio,
        height: screenSize.height * window.devicePixelRatio
    }
};
