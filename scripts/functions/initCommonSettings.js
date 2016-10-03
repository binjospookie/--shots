const commonSettingsInputChangeHandler = require('./commonSettingsInputChangeHandler');

module.exports = function initCommonSettings(settings) {
  let commonSettings = localStorage.getItem('commonSettings');
  let labels = settings.querySelectorAll('label[data-type="common"]');
  let array;
  let input;

  if (commonSettings !== null) {
    array = JSON.parse(commonSettings);
    Array.prototype.forEach.call(
      labels,
      (label) => {
        input = label.querySelector('input');
        if(array.indexOf(input.value) !== -1) {
          input.checked = true;
        }
      }
    )
  }
  Array.prototype.forEach.call(
    labels,
    (label) => {
      label.addEventListener('change', commonSettingsInputChangeHandler);
    }
  )
}
