module.exports = function hideLoader(difference, text, loaderText) {
  let callAfter;

  if (difference >= 2000) {
    loaderText.textContent = text;
    setTimeout(() => {
        loader.classList.remove('show');
    }, 1500)
  } else {
    loaderText.textContent = text;
    callAfter = 2000 - difference;
    setTimeout(() => {
        loader.classList.remove('show');
    }, callAfter)
  }
};
