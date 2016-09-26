module.exports = function arrowListeners(stageMouseDownHandlerArrow, stageMouseUpShapes, stage) {
  stage.on("stagemousedown", stageMouseDownHandlerArrow);
  stage.on("stagemouseup", stageMouseUpShapes);
}
