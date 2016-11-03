module.exports = function cropListeners(stageMouseDownHandlerCrop, stageMouseUpHandlerCrop, stageMouseMoveHandlerCrop, stage, body) {
  body.classList.add('crop');
  stage.on('stagemousedown', stageMouseDownHandlerCrop);
  stage.on('stagemouseup', stageMouseUpHandlerCrop);
  stage.on('stagemousemove', stageMouseMoveHandlerCrop);
};
