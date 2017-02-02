module.exports = function commonSettingsInputChangeHandler(event) {
  const target = event.target;
  const commonSettings = JSON.parse(localStorage.getItem('commonSettings'));
  if (target.type === 'checkbox') {
      commonSettings[target.name] = target.checked;
  }
  else {
     commonSettings[target.name] = target.value;
  }
  localStorage.setItem('commonSettings', JSON.stringify(commonSettings));
}
