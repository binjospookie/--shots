module.exports = function createDeleteButton() {
    var container;
    var close;

    container = new createjs.Container();
    container.name = 'close';

    close = new createjs.Shape();
    close.graphics.beginFill('#00428F').drawCircle(10, 10, 10).endFill()
        .beginStroke('#ffffff').setStrokeStyle(2, 'round').moveTo(7, 7).lineTo(13, 13)
        .moveTo(13, 7).lineTo(7, 13);
    close.shadow = new createjs.Shadow("#000000", 0, 2, 20);
    container.addChild(close);

    return container;
}
