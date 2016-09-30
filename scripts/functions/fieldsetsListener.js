module.exports = function fieldsetsListener(event) {
  let target = event.target;
  let optionObj = {};
  let storage = localStorage.getItem('settings');
  let existSettings = [];
  let filteredArray;

  if (target.checked === true ) {
    localStorage.removeItem('settings');
    optionObj[target.value] = true;
    existSettings.push(optionObj);
  }

  if (existSettings.length === 0) {
    localStorage.removeItem('settings');
  } else {
      localStorage.setItem('settings', JSON.stringify(existSettings));
  }
}
