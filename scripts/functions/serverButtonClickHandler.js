module.exports = function serverButtonClickHandler(event) {
 let button = event.target;
 let buttonTextContent = button.textContent;
 let storage = localStorage.getItem('serverpath');
 let storageValue = (storage === null || storage === ' ') ? '' :  JSON.parse(storage);
 let input = document.getElementById('serverinput');

 input.classList.toggle('visible');

 if(buttonTextContent === 'Save') {
   button.textContent = 'Change server path';
   localStorage.removeItem('serverpath');
   // а если нет, то сам виноват
   if (/^\s+$/.test(input.value) !== true && input.value !== '') {
     localStorage.setItem('serverpath', JSON.stringify(input.value));
   }
 } else {
   button.textContent = 'Save';
   if(storageValue !== '') {
     input.value = storageValue;
   }
 }
}
