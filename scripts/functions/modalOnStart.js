module.exports = function modalOnStart(body, modalWindow) {
  if (localStorage.getItem('modal') === null) {
    setTimeout(() => {
      modalWindow.classList.toggle('open');
      body.classList.toggle('modal');
      localStorage.setItem('modal', 'was opened');
    }, 200);
  }
}
