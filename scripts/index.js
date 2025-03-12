// Инициализация базовых переменных
const placesList = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

// Функция создания карточки
function createCard(cardData, deleteCallback) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик удаления
  deleteButton.addEventListener("click", () => deleteCallback(cardElement));

  return cardElement;
}

// Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// Вывести карточки на страницу
function renderCards(cards) {
  cards.forEach((card) => {
    const cardElement = createCard(card, deleteCard);
    placesList.append(cardElement);
  });
}

// Вызов функции рендеринга
renderCards(initialCards);