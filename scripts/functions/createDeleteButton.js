module.exports = function createDeleteButton() {
    var container;
    var close;

    container = new createjs.Container();
    container.name = 'close';

    close = new createjs.Shape();
    close.graphics.beginFill('#37aee2').drawCircle(10, 10, 10).endFill()
        .beginStroke('#ffffff').setStrokeStyle(2, 'round').moveTo(7, 7).lineTo(13, 13)
        .moveTo(13, 7).lineTo(7, 13);
    close.shadow = new createjs.Shadow("rgba(0,0,0,0.19)", 0, 10, 20);
    container.addChild(close);

    return container;
}
