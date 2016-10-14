module.exports = function setDefaultFrame(frame) {
  frame.classList.remove('show');
  frame.style.width = 0;
  frame.style.height = 0;
  frame.style.top = 0;
  frame.style.left = 0;
};
