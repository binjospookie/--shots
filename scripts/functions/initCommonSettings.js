const commonSettingsInputChangeHandler = require('./commonSettingsInputChangeHandler');

module.exports = function initCommonSettings(settings) {
  const commonSettings = JSON.parse(localStorage.getItem('commonSettings'));
  const inputs = settings.querySelectorAll('input[data-type="common"]');

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
