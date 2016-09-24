module.exports = function createTransformButton() {
    let container;
    let transform;

    container = new createjs.Container();
    container.name = 'transform';

    transform = new createjs.Shape();
    transform.graphics.beginFill("#00428F").drawCircle(-10, -10, 10).endFill()
        .beginStroke("#ffffff").setStrokeStyle(2, 'round').moveTo(-6, -10).lineTo(-6, -14).lineTo(-10, -14)
        .moveTo(-14, -10).lineTo(-14, -6).lineTo(-10, -6).endFill();
    transform.shadow = new createjs.Shadow("#000000", 0, 2, 20);
    container.addChild(transform);

    return container;
}
