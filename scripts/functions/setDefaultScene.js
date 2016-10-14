module.exports = function setDefaultScene(stage, stageMouseDownHandler, body) {
  stage.removeAllEventListeners();
  stage.addEventListener('mousedown', stageMouseDownHandler);

  body.classList.remove('crop');
  body.classList.remove('move');
};
