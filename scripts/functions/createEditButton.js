module.exports = function createEditButton() {
  const container = new createjs.Container();
  container.name = 'edit';

  const edit = new createjs.Shape();
  edit.graphics.beginFill('red').drawCircle(10, 10, 10).endFill()
  edit.shadow = new createjs.Shadow('rgba(0,0,0,0.19)', 0, 10, 20);
  container.addChild(edit);

  return container;
};
