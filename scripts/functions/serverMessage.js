module.exports = function serverMessage(version) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://theshots.ru/serverMessage.php');
  xhr.send();
  xhr.onload = () => {
    switch (xhr.status) {
      case 500:
        alert('Server error 😱');
        break;

      case 400:
        alert('An impossible request 😱');
        break;

      case 401:
        alert('Auth error 😱');
        break;

      case 200:
        if (xhr) {
            if (xhr.responseText !== '' &&
            xhr.responseText !== 'This is deprecated version. Please update the app to version 0.1.1.') {
                  alert(xhr.responseText);
            }
        }
        break;

      default:
        alert('Unknown error 😱');
        break;
    }
  };
};
