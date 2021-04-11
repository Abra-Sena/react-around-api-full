const showErrorMessage = (form, input, settings) => {
    const error = form.querySelector(`#${input.id}-error`);
    error.textContent = input.validationMessage;

    error.classList.add(settings.errorClass);
    input.classList.add(settings.inputErrorClass);
  }

  const hideErrorMessage = (form, input, settings) => {
    const error = form.querySelector(`#${input.id}-error`);
    error.textContent = '';

    error.classList.remove(settings.errorClass);
    input.classList.remove(settings.inputErrorClass);
  }

  const checkInputValidity = (form, input, errorClass, inputErrorClass) => {
    if(input.validity.valid) {
      hideErrorMessage(form, input, errorClass, inputErrorClass);
    } else {
      showErrorMessage(form, input, errorClass, inputErrorClass);
    }
  }

  const toggleButtonState = (inputs, button, inactiveButtonClass) => {
    const isValid = inputs.every((input) => input.validity.valid);

    if(isValid) {
      button.classList.remove(inactiveButtonClass);
      button.classList.remove('form__submit_disabled');
    } else {
      button.classList.add(inactiveButtonClass);
      button.classList.add('form__submit_disabled');
    }
  }

  const setEventListeners = (form, settings) => {
    const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
    const button = form.querySelector(settings.submitButtonSelector);

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        checkInputValidity(form, input, settings);
        toggleButtonState(inputs, button, settings.inactiveButtonClass);
      });
    });
  }

  const enableValidation = (settings) => {
    const forms = Array.from(document.querySelectorAll(settings.formSelector));

    forms.forEach((form) => {
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
      });

      setEventListeners(form, settings);
    });
  }

  enableValidation({
    formSelector: ".form",
    inputSelector: ".form__input",
    submitButtonSelector: ".form__submit",
    inactiveButtonClass: "form__submit_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible"
  });
