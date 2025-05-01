export const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  disabledButtonClass: "popup__button_disabled",
  errorInputClass: "popup__input_type_error",
  hiddenErrorClass: "popup__error_invisible",
  visibleErrorClass: "popup__error_visible",
};

// --- Работа с ошибками ---

const displayError = (form, input, message, config) => {
  const error = form.querySelector(`.${input.name}-error`);
  input.classList.add(config.errorInputClass);
  error.textContent = message;
  error.classList.add(config.visibleErrorClass);
};

const removeError = (form, input, config) => {
  const error = form.querySelector(`.${input.name}-error`);
  input.classList.remove(config.errorInputClass);
  error.textContent = "";
  error.classList.remove(config.visibleErrorClass);
};

// --- Проверка валидности ---

const validateField = (form, input, config) => {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage || "");
  } else {
    input.setCustomValidity("");
  }

  if (!input.validity.valid) {
    displayError(form, input, input.validationMessage, config);
  } else {
    removeError(form, input, config);
  }
};

const hasInvalidFields = (fields) => {
  return fields.some((field) => !field.validity.valid);
};

const updateButtonState = (fields, button, config) => {
  const hasErrors = hasInvalidFields(fields);
  button.disabled = hasErrors;
  button.classList.toggle(config.disabledButtonClass, hasErrors);
};

// --- Инициализация валидации ---

const initFormValidation = (form, config) => {
  const fields = Array.from(form.querySelectorAll(config.inputSelector));
  const submitBtn = form.querySelector(config.submitButtonSelector);

  updateButtonState(fields, submitBtn, config);

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      validateField(form, field, config);
      updateButtonState(fields, submitBtn, config);
    });
  });
};

const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => initFormValidation(form, config));
};

// --- Очистка ошибок ---

const clearValidation = (form, config) => {
  const submitBtn = form.querySelector(config.submitButtonSelector);
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));

  submitBtn.disabled = true;
  submitBtn.classList.add(config.disabledButtonClass);

  inputs.forEach((input) => removeError(form, input, config));
};

export { enableValidation, clearValidation };
