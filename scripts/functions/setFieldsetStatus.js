module.exports = function setFieldsetStatus(fieldsets, status) {
  let state = status;
  const form = document.getElementById('settingsForm');
  const buttton = form.querySelector('#applyCustom');
  let existSettings = [];
  let optionObj = {};
  let inputs;

  if (status === true) {
    localStorage.removeItem('settings');
  } else {
    Array.prototype.forEach.call(
      fieldsets,
      (fieldset) => {
        inputs = fieldset.querySelectorAll('input')
        Array.prototype.forEach.call(
          inputs,
          (input) => {
            if (input.checked === true) {
              optionObj[input.value] = true;
              existSettings.push(optionObj);
              localStorage.setItem('settings', JSON.stringify(existSettings));
            }
          }
        );
      }
    );
  }

  Array.prototype.forEach.call(
    fieldsets,
    (fieldset) => {
      fieldset.disabled = state;
    }
  );
}
