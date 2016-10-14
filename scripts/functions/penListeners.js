module.exports = function penListeners(stageMouseDownHandlerPen, stageMouseUpShapes, stage) {
  stage.on('stagemousedown', stageMouseDownHandlerPen);
  stage.on('stagemouseup', stageMouseUpShapes);
};
