export function openModal(popup) {
  popup.classList.add("popup_is-opened");

  const handleEscClose = (event) => {
    if (event.key === "Escape") {
      closeModal(popup);
    }
  };

  document.addEventListener("keydown", handleEscClose);
  popup.escHandler = handleEscClose;
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");

  if (popup.escHandler) {
    document.removeEventListener("keydown", popup.escHandler);
    delete popup.escHandler;
  }
}

export function handlePopupClick(event) {
  const popup = event.currentTarget;

  const isOverlay = event.target === popup;
  const isCloseButton = event.target.classList.contains("popup__close");

  if (isOverlay || isCloseButton) {
    closeModal(popup);
  }
}
