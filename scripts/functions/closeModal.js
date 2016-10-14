module.exports = function closeModalButtonClickHandler(body, modalWindow) {
  modalWindow.classList.remove('open');
  body.classList.remove('modal');
};
