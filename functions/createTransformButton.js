module.exports = function createTransformButton() {
  const container = new createjs.Container();
  container.name = 'transform';

  const transform = new createjs.Shape();
  transform.graphics.beginFill('#37aee2').drawCircle(-10, -10, 10).endFill()
      .beginStroke('#ffffff')
      .setStrokeStyle(2, 'round')
      .moveTo(-14, -10)
      .lineTo(-14, -14)
      .lineTo(-10, -14)
      .moveTo(-6, -10)
      .lineTo(-6, -6)
      .lineTo(-10, -6)
      .endFill();
  transform.shadow = new createjs.Shadow('rgba(0,0,0,0.19)', 0, 10, 20);
  container.addChild(transform);

  return container;
};
