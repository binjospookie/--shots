module.exports = function signinFormSubmitHandler(event) {
  event.preventDefault();

  const form = event.target;
  let login = form.elements['login'].value;
  let password = form.elements['password'].value;

  sendRequest({
    login: login,
    password: password,
  }, event.target);
}

function sendRequest(data) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  xhr.onload = (event) => {
    switch (xhr.status) {
      case 500:
        alert('Server error 😱');
        break;

      case 400:
        alert('An impossible request 😱');
        break;

      case 401:
        alert('Incorrect pair 😱')
        break;

      case 200:
        if (xhr) {
          data = JSON.parse(xhr.responseText);
          if (xhr.responseText === false) {
              alert('Incorrect pair 😱');
          } else {
              alert('You have been authorized 🐮');
              localStorage.setItem('token', xhr.responseText);
              document.body.classList.remove('modal');
              document.querySelector('aside.sign-in').classList.remove('open');
          }
        }
        break;

      default:
        alert('Unknown error 😱');
        break;
    }
  };

  xhr.open('post', 'https://theshots.ru/admin/auth.php', true);
  formData.append('data', JSON.stringify(data));
  xhr.send(formData);
}
