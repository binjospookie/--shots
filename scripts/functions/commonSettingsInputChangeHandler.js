module.exports = function commonSettingsInputChangeHandler(event) {
  const target = event.target;
  const commonSettings = localStorage.getItem('commonSettings');
  let array;
  let index;

  if (target.checked === true) {
    if (commonSettings == null) {
      array = [];
    } else {
      array = JSON.parse(commonSettings);
    }
    array.push(target.value);
    localStorage.setItem('commonSettings', JSON.stringify(array));
  } else {
    array = JSON.parse(commonSettings);
    index = array.indexOf(target.value);

    if (index !== -1) {
      array.splice(index, 1);
    }

    localStorage.setItem('commonSettings', JSON.stringify(array));

    if (array.length === 0) {
      localStorage.removeItem('commonSettings');
    }
  }
};
