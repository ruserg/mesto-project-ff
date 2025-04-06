export function openModal(popup) {
  popup.classList.add("popup_is-opened");

  const closeButton = popup.querySelector(".popup__close");
  if (closeButton) {
    const handleCloseClick = () => closeModal(popup);
    closeButton.addEventListener("click", handleCloseClick);
    popup.closeHandler = handleCloseClick;
  }

  const handleOverlayClick = (event) => {
    if (event.target === popup) {
      closeModal(popup);
    }
  };
  popup.addEventListener("click", handleOverlayClick);
  popup.overlayHandler = handleOverlayClick;

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

  const closeButton = popup.querySelector(".popup__close");
  if (closeButton && popup.closeHandler) {
    closeButton.removeEventListener("click", popup.closeHandler);
    delete popup.closeHandler;
  }

  if (popup.overlayHandler) {
    popup.removeEventListener("click", popup.overlayHandler);
    delete popup.overlayHandler;
  }

  if (popup.escHandler) {
    document.removeEventListener("keydown", popup.escHandler);
    delete popup.escHandler;
  }
}
