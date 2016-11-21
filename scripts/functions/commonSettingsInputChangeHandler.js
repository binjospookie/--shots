module.exports = function commonSettingsInputChangeHandler(localstorageColorChangeHandler, event) {
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
  } else if(target.type === 'color') {
    if (commonSettings == null) {
      array = [];
    } else {
      array = JSON.parse(commonSettings);
    }
    let colorIndex = array.indexOf(findColorInArray(array));
    if (colorIndex > -1) {
        array.splice(colorIndex, 1);
    }
    array.push(target.value);
    localStorage.setItem('commonSettings', JSON.stringify(array));
    localstorageColorChangeHandler(target.value);
    // TODO: delete old color
  } else {
    array = JSON.parse(commonSettings);
    if (!array) {
      return;
    }
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

function findColorInArray(array) {
  let colorInArray;

  array.forEach((element)=>{
    if (element.charAt(0) === '#') {
      colorInArray = element;
    }
  });

  return colorInArray;
}
