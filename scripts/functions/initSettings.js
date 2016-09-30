const setFieldsetStatus = require('./setFieldsetStatus');
const fieldsetsListener = require('./fieldsetsListener');

module.exports = function initSettings(settings) {
  let customCheckbox = settings.querySelector('#applyCustom');
  let fieldsets =  settings.querySelectorAll('fieldset');
  let inputs = settings.querySelectorAll('fieldset > ul > li > input');
  let storage = localStorage.getItem('settings');
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
  )
}
