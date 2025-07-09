import { Api } from "./Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    Authorization: "379803de-4d40-4606-8a13-094952d961f8",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userData, cards]) => {
    // Set user info
    profileName.textContent = userData.name;
    profileTitle.textContent = userData.about;
    // Render cards
    cards.forEach((item) => {
      const card = getCard(item);
      cardSection.append(card);
    });
  })
  .catch((err) => {
    console.error(err);
  });

const cardDeleteButton = document.querySelector("#card-delete");
const cardCancelButton = document.querySelector("#card-cancel");
const cardClosedButton = document.querySelector(".card-riddance__close");
const cardDrop = document.querySelector("#card-riddance-modal");
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__preview-image");
const previewTitle = previewModal.querySelector(".modal__preview-title");
const newPostButton = document.querySelector(".profile__post-button");
const editCardModal = document.querySelector("#add-card-modal");
const editProfileModal = document.querySelector("#edit-modal");
const profileName = document.querySelector(".profile__name");
const profileTitle = document.querySelector(".profile__title");
const profileInputName = document.querySelector("#name");
const profileInputTitle = document.querySelector("#description");
const profileEditButton = document.querySelector(".profile__edit-button");
const editForm = document.forms["edit-profile"];
const cardForm = editCardModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card-template");
const cardSection = document.querySelector(".cards__list");
const cardNameInput = document.querySelector("#add-card-name");
const cardLinkInput = document.querySelector("#add-card-link");

let cardToDelete = null;
let cardIdToDelete = null;

function getCard(data) {
  const card = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardName = card.querySelector(".card__title");
  const cardImage = card.querySelector(".card__image");
  const cardLikeIcon = card.querySelector(".card__like-icon");
  const deleteButton = card.querySelector(".card__delete");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardName.textContent = data.name;

  // When trash icon is clicked, open confirmation and store card info
  deleteButton.addEventListener("click", () => {
    cardDrop.classList.add("card-riddance__opened");
    cardToDelete = card;
    cardIdToDelete = data._id;
  });

  cardClosedButton.addEventListener("click", () => {
    cardDrop.classList.remove("card-riddance__opened");
  });
  cardImage.addEventListener("click", () => {
    openPreviewModal(data);
  });

  return card;
}

// When confirm delete button is clicked
cardDeleteButton.addEventListener("click", () => {
  if (cardIdToDelete) {
    // Server card
    api
      .removeCard({ cardID: cardIdToDelete })
      .then(() => {
        if (cardToDelete) cardToDelete.remove();
        cardDrop.classList.remove("card-riddance__opened");
        cardToDelete = null;
        cardIdToDelete = null;
      })
      .catch((error) => console.error("Error deleting card:", error));
  } else if (cardToDelete) {
    // Local card (no _id)
    cardToDelete.remove();
    cardDrop.classList.remove("card-riddance__opened");
    cardToDelete = null;
  }
});

cardCancelButton.addEventListener("click", () => {
  cardDrop.classList.remove("card-riddance__opened");
  cardToDelete = null;
  cardIdToDelete = null;
});

function openPreviewModal(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewTitle.textContent = data.name;
  openModal(previewModal);
}

function handleEditForm(evt) {
  evt.preventDefault();
  const name = profileInputName.value;
  const about = profileInputTitle.value;

  api
    .editUserInfo({ name, about })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileTitle.textContent = userData.about;
      // If you have an avatar: profileAvatar.src = userData.avatar;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Failed to update profile:", err);
    });
}

profileEditButton.addEventListener("click", () => {
  profileInputName.value = profileName.textContent;
  profileInputTitle.value = profileTitle.textContent;
  const editFormButton = editForm.querySelector(".modal__submit-btn");

  resetValidation(
    editForm,
    [profileInputName, profileInputTitle],
    editFormButton,
    settings
  );
  openModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  openModal(editCardModal);
});

editForm.addEventListener("submit", handleEditForm);
cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  api
    .addCard({ name, link })
    .then((cardData) => {
      const newCard = getCard(cardData);
      cardSection.prepend(newCard);
      cardForm.reset();
      closeModal(editCardModal);
    })
    .catch((err) => {
      console.error("Failed to add card:", err);
    });
});

initialCards.forEach((item) => {
  const positioning = getCard(item);
  cardSection.append(positioning);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

const closeButtons = Array.from(document.querySelectorAll(".modal__close-btn"));
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => {
    closeModal(modal);
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

const settings = {
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Move this function to the top level, outside of any event listeners
function resetValidation(editForm, inputs, button, settings) {
  // Placeholder: clear errors and reset button state
  inputs.forEach((input) => {
    input.setCustomValidity("");
    input.classList.remove("input-error");
  });
  button.disabled = false;
}
