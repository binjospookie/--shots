module.exports = function popUp(popupWindow, paragraph, text, removeClass) {
  paragraph.textContent = text;
  popupWindow.classList.add('show-hide');

  if (removeClass !== true) {
    setTimeout(
      () => { popupWindow.classList.remove('show-hide'); }, 2300
    );
  }
};
