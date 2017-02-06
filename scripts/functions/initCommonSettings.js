const commonSettingsInputChangeHandler = require('./commonSettingsInputChangeHandler');

module.exports = function initCommonSettings(settings) {
  let commonSettings = JSON.parse(localStorage.getItem('commonSettings'));
  const inputs = settings.querySelectorAll('input[data-type="common"]');
  
  // migrate to 1.1.0
  if (Array.isArray(commonSettings)) {
    commonSettings = {};
    localStorage.setItem('commonSettings', JSON.stringify({}));
  }
  
  Array.prototype.forEach.call(
    inputs,
    (input) => {
      if (commonSettings) {
        if (input.type === 'checkbox') {
          input.checked = commonSettings[input.name]?commonSettings[input.name]:input.checked;
        }
        else {
          input.value = commonSettings[input.name]?commonSettings[input.name]:input.value;
        }
      }
      input.addEventListener('change', commonSettingsInputChangeHandler);
    }
  );
  if (!commonSettings) {
    localStorage.setItem('commonSettings', '{}');
  }
};
