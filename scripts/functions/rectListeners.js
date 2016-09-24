module.exports = function rectListeners(stageMouseDownHandlerRect, stageMouseUpShapes, stage) {
  stage.on("stagemousedown", stageMouseDownHandlerRect);
  stage.on("stagemouseup", stageMouseUpShapes);
}
