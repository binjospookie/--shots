module.exports = function showControls(container, stage) {
    let i;
    let n;

    for (i = 0, n = container.children.length; i < n; i++) {
        if ((container.children[i].name === 'close') || (container.children[i].name === 'transform')) {
            container.children[i].visible = true;
        }
    }
    stage.update();
}
