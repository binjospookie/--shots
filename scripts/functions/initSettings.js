const setFieldsetStatus = require('./setFieldsetStatus');
const fieldsetsListener = require('./fieldsetsListener');

module.exports = function initSettings(settings) {
  const customCheckbox = settings.querySelector('#applyCustom');
  const fieldsets = settings.querySelectorAll('fieldset');
  const inputs = settings.querySelectorAll('fieldset > ul > li > input');
  const storage = localStorage.getItem('settings');
  const pathValue = localStorage.getItem('savePath');
  const path = settings.querySelector('div.path');

  let settingsValue;
  let settingName = '';

  if (storage === null) {
    setFieldsetStatus(fieldsets, true);
  } else {
    settingsValue = JSON.parse(storage);
    settingName = Object.keys(settingsValue[0])[0];
    settingName = settingName.replace(/\s/g, '');
    settings.querySelector(`#${settingName}`).checked = true;
    customCheckbox.checked = true;
  }
  Array.prototype.forEach.call(
    inputs,
    (input) => {
      input.addEventListener('change', fieldsetsListener, false);
    }
  );

  path.textContent = (pathValue === null) ? 'Selected: default' : `Selected ${pathValue}`;
};
