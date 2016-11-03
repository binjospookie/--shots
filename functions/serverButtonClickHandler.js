module.exports = function serverButtonClickHandler(event) {
  const button = event.target;
  const buttonTextContent = button.textContent;
  const storage = localStorage.getItem('serverpath');
  const storageValue = (storage === null || storage === ' ') ? '' : JSON.parse(storage);
  const input = document.getElementById('serverinput');

  input.classList.toggle('visible');

  if (buttonTextContent === 'Save') {
    button.textContent = 'Change server path';
    localStorage.removeItem('serverpath');
    // а если нет, то сам виноват
    if (/^\s+$/.test(input.value) !== true && input.value !== '') {
      localStorage.setItem('serverpath', JSON.stringify(input.value));
    }
  } else {
    button.textContent = 'Save';
    if (storageValue !== '') {
      input.value = storageValue;
    }
  }
};
