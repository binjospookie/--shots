module.exports = function serverMessage() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://shots.binjo.ru/serverMessage.php");
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
                  if(xhr.responseText !== '') {
                        alert(xhr.responseText);
                  }
              }

              break;

          default:
              alert('Unknown error 😱');
              break;
      }
  }
}
