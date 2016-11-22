module.exports = function createEditButton(bitmap) {
  const container = new createjs.Container();
  container.name = 'edit';

  const edit = new createjs.Shape();
  const icon = new createjs.Bitmap(bitmap);

  edit.graphics.beginFill('#37aee2').drawCircle(10, 10, 10).endFill();
  edit.shadow = new createjs.Shadow('rgba(0,0,0,0.19)', 0, 10, 20);
  icon.x = 3;
  icon.y = 3;
  container.addChild(edit);
  container.addChild(icon);
  return container;
};
