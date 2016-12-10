const commonSettingsInputChangeHandler = require('./commonSettingsInputChangeHandler');

module.exports = function initCommonSettings(settings, localstorageColorChangeHandler) {
  const commonSettings = localStorage.getItem('commonSettings');
  const labels = settings.querySelectorAll('label[data-type="common"]');
  let array;
  let input;

  if (commonSettings !== null) {
    array = JSON.parse(commonSettings);
    Array.prototype.forEach.call(
      labels,
      (label) => {
        input = label.querySelector('input');
        if (array.indexOf(input.value) !== -1) {
          input.checked = true;
        } else if (input.type === 'color') {
            array.forEach((settingValue)=>{
            if (settingValue.charAt(0) === '#') {
              input.value = settingValue;
            }
          });
        } else if (input.type === 'number') {
          array.forEach((settingValue)=>{
          if (settingValue.charAt(0) === '$') {
            input.value = settingValue.split('$')[1];
          }
        });
        }
      }
    );
  }
  Array.prototype.forEach.call(
    labels,
    (label) => {
      label.addEventListener('change', commonSettingsInputChangeHandler.bind(null, localstorageColorChangeHandler));
    }
  );
};
