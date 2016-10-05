module.exports = function signinFormSubmitHandler(event) {
  event.preventDefault();

  let form = event.target;
  let login = form.elements['login'].value;
  let password = form.elements['password'].value;

  sendRequest({
        login: login,
        password: password
    });
}

function sendRequest(data) {
    var xhr;
    var formData;

    xhr = new XMLHttpRequest();
    formData = new FormData();

    xhr.onload = function() {
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
                    }
                }

                break;

            default:
                alert('Unknown error 😱');
                break;
        }
    }

    xhr.open('post', 'http://theshots.ru/admin/auth.php', true);
    formData.append('data', JSON.stringify(data));
    xhr.send(formData);
};
