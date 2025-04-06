import "./index.css";
import { initialCards } from "../components/initial_cards.js";
import { createCard, toggleLike, deleteCard } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";

// Анимация попапов
document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

// DOM-элементы
const container = document.querySelector(".content");
const cardsContainer = container.querySelector(".places__list");

const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

const popupImageTag = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");

const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const placeNameInput = newCardForm.querySelector(".popup__input_type_card-name");
const placeLinkInput = newCardForm.querySelector(".popup__input_type_url");

// Модальное изображение
function openImagePopup(name, link) {
  popupImageTag.src = link;
  popupImageTag.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
}

// Заполняем форму редактирования профиля
function fillEditProfileForm() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
}

// Отправка формы профиля
function handleProfileEditSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModal(popupEdit);
}

// Отправка формы новой карточки
function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  const newCard = createCard({ name, link }, deleteCard, toggleLike, openImagePopup);
  cardsContainer.prepend(newCard);

  closeModal(popupNewCard);
  newCardForm.reset();
}

// Инициализация карточек
initialCards.forEach((element) => {
  const card = createCard(element, deleteCard, toggleLike, openImagePopup);
  cardsContainer.append(card);
});

// Обработчики кнопок
editButton.addEventListener("click", () => {
  fillEditProfileForm();
  openModal(popupEdit);
});

addButton.addEventListener("click", () => {
  openModal(popupNewCard);
});

formElement.addEventListener("submit", handleProfileEditSubmit);
newCardForm.addEventListener("submit", handleNewCardSubmit);