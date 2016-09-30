module.exports = function getSettings() {
  const obj = JSON.parse(localStorage.getItem('settings'));

  return (obj === null) ? 'empty' : (Object.keys(obj[0])[0]);
}
