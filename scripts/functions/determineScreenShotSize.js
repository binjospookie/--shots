const electron = require('electron');
const electronScreen = electron.screen;
/**
 * Получение размеров окна для скриншота и размеров окна приложения
 * @returns {{width: number, height: number}}
 */
module.exports = function determineScreenShotSize() {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;

    let i;
    let displaysArray = electronScreen.getAllDisplays();
    let width = 0;
    let height = 0;
    for (i=0;i<displaysArray.length;i++) {

      if (displaysArray[i].workArea.height > height) {
        height = displaysArray[i].workArea.height;
      }
       width = width +  displaysArray[i].workArea.width;
    }

    return {
        width: width,
        height: height
    }
};
