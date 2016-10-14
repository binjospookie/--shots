module.exports =
    function
addModalButtonListeners(closeModalButtons, closeModalButtonClickHandler, body, modalWindow) {
      Array.prototype.forEach.call(
          closeModalButtons, (button) => {
            button.addEventListener('click', closeModalButtonClickHandler.bind(this, body, modalWindow), false);
          }
      );
    };
