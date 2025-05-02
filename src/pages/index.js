import "./index.css";

import { createCard, toggleLike, deleteCard } from "../components/card.js";
import {
  openModal,
  closeModal,
  handlePopupClick,
} from "../components/modal.js";
import {
  validationSettings,
  enableValidation,
  clearValidation,
} from "../components/validation.js";
import {
  apiGetUserInfo,
  apiGetCards,
  apiUpdateUserInfo,
  apiAddNewCard,
  apiUpdateAvatar,
} from "../components/api.js";

// DOM-элементы
const container = document.querySelector(".content");
const cardsContainer = container.querySelector(".places__list");

const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const avatarPopup = document.querySelector(".popup_type_update-avatar");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const avatarImage = document.querySelector(".profile__image");

const popupImageTag = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");

const editProfileForm = document.forms["edit-profile"];
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(
  ".popup__input_type_description"
);
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

const newCardForm = document.forms["new-place"];
const placeNameInput = newCardForm.querySelector(
  ".popup__input_type_card-name"
);
const placeLinkInput = newCardForm.querySelector(".popup__input_type_url");

const avatarForm = document.forms["update-avatar"];
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar-url");

// Переменная для хранения ID пользователя
let userId;

// --- Основные функции ---

const openImagePopup = (name, link) => {
  popupImageTag.src = link;
  popupImageTag.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
};

const fillEditProfileForm = () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
};

const setLoadingState = (button, isLoading, { loadingText = "Сохранение...", defaultText } = {}) => {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText || button.dataset.originalText;
  }
};

const handleProfileEditSubmit = (evt) => {
  evt.preventDefault();
  const name = nameInput.value;
  const about = jobInput.value;

  submitUserProfile(name, about).then(() => {
    profileName.textContent = name;
    profileJob.textContent = about;
    closeModal(popupEdit);
  });
};

const handleNewCardSubmit = (evt) => {
  evt.preventDefault();
  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  submitNewCard(name, link).then((newCardData) => {
    const newCard = createCard(newCardData, {
      deleteCallback: deleteCard,
      likeCallback: toggleLike,
      imageClickCallback: openImagePopup,
      userId: userId,
    });
    cardsContainer.prepend(newCard);
    closeModal(popupNewCard);
    newCardForm.reset();
  });
};

const handleAvatarSubmit = (evt) => {
  evt.preventDefault();
  const avatarUrl = avatarInput.value;

  submitAvatarUpdate(avatarUrl).then(() => {
    closeModal(avatarPopup);
    avatarForm.reset();
  });
};

const renderUserProfile = (userData) => {
  profileName.textContent = userData.name;
  profileJob.textContent = userData.about;
  avatarImage.style.backgroundImage = `url(${userData.avatar})`;
};

const renderCards = (cards, userId) => {
  cards.forEach((cardData) => {
    const card = createCard(cardData, {
      deleteCallback: deleteCard,
      likeCallback: toggleLike,
      imageClickCallback: openImagePopup,
      userId: userId,
    });
    cardsContainer.append(card);
  });
};

// --- Отправка данных ---

const submitUserProfile = (name, about) => {
  const saveButton = editProfileForm.querySelector(".popup__button");
  setLoadingState(saveButton, true);

  return apiUpdateUserInfo(name, about)
    .then((updatedUserData) => {
      console.log("Профиль успешно обновлён на сервере:", updatedUserData);
    })
    .catch((err) => {
      console.log("Ошибка при обновлении профиля на сервере:", err);
    })
    .finally(() => {
      setLoadingState(saveButton, false);
    });
};

const submitNewCard = (name, link) => {
  const saveButton = newCardForm.querySelector(".popup__button");
  setLoadingState(saveButton, true, { loadingText: "Создание..." });

  return apiAddNewCard(name, link)
    .then((newCardData) => {
      console.log("Карточка успешно добавлена на сервер:", newCardData);
      return newCardData;
    })
    .catch((err) => {
      console.log("Ошибка при добавлении карточки на сервер:", err);
    })
    .finally(() => {
      setLoadingState(saveButton, false);
    });
};

const submitAvatarUpdate = (avatarUrl) => {
  const saveButton = avatarForm.querySelector(".popup__button");
  setLoadingState(saveButton, true);

  return apiUpdateAvatar(avatarUrl)
    .then((updatedUserData) => {
      avatarImage.style.backgroundImage = `url(${updatedUserData.avatar})`;
    })
    .catch((err) => {
      console.log("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
      setLoadingState(saveButton, false);
    });
};

// --- Обработчики событий ---

editButton.addEventListener("click", () => {
  fillEditProfileForm();
  clearValidation(editProfileForm, validationSettings);
  openModal(popupEdit);
});

addButton.addEventListener("click", () => {
  openModal(popupNewCard);
  clearValidation(newCardForm, validationSettings);
  newCardForm.reset();
});

avatarImage.addEventListener("click", () => {
  clearValidation(avatarForm, validationSettings);
  avatarForm.reset();
  openModal(avatarPopup);
});

editProfileForm.addEventListener("submit", handleProfileEditSubmit);
newCardForm.addEventListener("submit", handleNewCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
  popup.addEventListener("click", handlePopupClick);
});

// --- Инициализация ---

enableValidation(validationSettings);

Promise.all([apiGetUserInfo(), apiGetCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    renderUserProfile(userData);
    renderCards(cards, userId);
  })
  .catch((err) => {
    console.log("Произошла ошибка:", err);
  });
