module.exports = function textEventListeners(textareaContent, textateaFontSize, textateaFontColor, textareaValueChangeHadler,
   textareaFontSizeChangeHadler, textareaFontColorChangeHadler, deleteTextButton, deleteTextButtonClickHandler,
   applyTextButton, applyTextButtonClickHandler, closeTextFormButton, textSidebar) {
  textareaContent.addEventListener('keyup', textareaValueChangeHadler);
  textateaFontSize.addEventListener('keyup', textareaFontSizeChangeHadler);
  textateaFontSize.addEventListener('click', textareaFontSizeChangeHadler);
  textateaFontColor.addEventListener('change', textareaFontColorChangeHadler);
  deleteTextButton.addEventListener('click', deleteTextButtonClickHandler);
  applyTextButton.addEventListener('click', applyTextButtonClickHandler);
  closeTextFormButton.addEventListener('click', applyTextButtonClickHandler);
  textSidebar.addEventListener('submit', 
    event => {
      event.preventDefault();
      applyTextButtonClickHandler();
    }
  );
};

