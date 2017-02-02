module.exports = function fieldsetsListener(event) {
  const target = event.target;
  const optionObj = {};
  const existSettings = [];

  if (target.checked === true) {
    localStorage.removeItem('settings');
    optionObj[target.value] = true;
    existSettings.push(optionObj);
  }

  if (existSettings.length === 0) {
    localStorage.removeItem('settings');
  } else {
    localStorage.setItem('settings', JSON.stringify(existSettings));
  }
};
