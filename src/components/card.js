import { apiDeleteCard, apiAddLike, apiRemoveLike } from "./api.js";

// --- Создание карточки ---

export const createCard = (
  element,
  { deleteCallback, likeCallback, imageClickCallback, userId } = {}
) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeAmount = cardElement.querySelector(".card__likes-amount");

  const likesCount = element.likes ? element.likes.length : 0;

  cardImage.src = element.link;
  cardImage.alt = element.name;
  cardTitle.textContent = element.name;
  likeAmount.textContent = likesCount > 0 ? likesCount : "";

  // Отмечаем активный лайк (если есть)
  if (element.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Прячем кнопку удаления, если карточка чужая
  if (element.owner && element.owner._id !== userId) {
    deleteButton.style.display = "none";
  }

  // Обработчики
  deleteButton.addEventListener("click", () =>
    deleteCallback(element._id, cardElement)
  );

  likeButton.addEventListener("click", () =>
    likeCallback(element._id, likeButton, likeAmount)
  );

  cardImage.addEventListener("click", () =>
    imageClickCallback(element.name, element.link)
  );

  return cardElement;
};

// --- Управление лайками ---

export const toggleLike = (cardId, likeButton, likeAmount) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  if (isLiked) {
    apiRemoveLike(cardId)
      .then((updatedCard) => {
        likeButton.classList.remove("card__like-button_is-active");
        likeAmount.textContent =
          updatedCard.likes.length > 0 ? updatedCard.likes.length : "";
      })
      .catch((err) => {
        console.log("Ошибка при удалении лайка:", err);
      });
  } else {
    apiAddLike(cardId)
      .then((updatedCard) => {
        likeButton.classList.add("card__like-button_is-active");
        likeAmount.textContent =
          updatedCard.likes.length > 0 ? updatedCard.likes.length : "";
      })
      .catch((err) => {
        console.log("Ошибка при добавлении лайка:", err);
      });
  }
};

// --- Удаление карточки ---

export const deleteCard = (cardId, cardElement) => {
  apiDeleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log("Ошибка при удалении карточки:", err);
    });
};
