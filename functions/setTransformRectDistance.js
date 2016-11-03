/**
 * Обработчик трансформации рамки
 */
const calcDistance = require('./calcDistance');

module.exports =
  function setTransformRectDistance(x, y, croppingHistory, historyIndex, activeShape, mouseDownX, mouseDownY) {
    let distance1;
    let distance2;

    if (croppingHistory[historyIndex] !== undefined && historyIndex !== 0) {
      distance1 = calcDistance(
          activeShape.x + croppingHistory[historyIndex].stageX, activeShape.y + croppingHistory[historyIndex].stageY,
          mouseDownX, mouseDownY
      );

      distance2 = calcDistance(
          activeShape.x + croppingHistory[historyIndex].stageX, activeShape.y + croppingHistory[historyIndex].stageY,
          x, y
      );
  } else {
      distance1 = calcDistance(
          activeShape.x, activeShape.y,
          mouseDownX, mouseDownY
      );

      distance2 = calcDistance(
          activeShape.x, activeShape.y,
          x, y
      );
    }

    return {
      distance1: distance1,
      distance2: distance2,
    };
  };
