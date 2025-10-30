import "../pages/index.css";
import { Api } from "./Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    Authorization: "348fed7e-2076-4846-8d99-5a6f2b50e55c",

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

const confirmDeleteButton = document.querySelector("#card-delete");
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
const avatarEditButton = document.querySelector(".profile__avatar-edit-button"); // your edit button selector
const avatarInput = document.querySelector("#avatar-link-input"); // your input selector for the avatar image link
const avatarForm = document.querySelector(".profile__avatar-edit-btn");
const profileAvatar = document.querySelector(".profile__avatar"); // the avatar image element

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

  cardLikeIcon.addEventListener("click", () => {
    console.log(data);
    if (cardLikeIcon.classList.contains("card__like-icon_active")) {
      // DISLIKE
      api
        .deleteCardLike(data._id)
        .then(() => {
          cardLikeIcon.classList.remove("card__like-icon_active");
        })
        .catch((err) => {
          cardLikeIcon.classList.remove("card__like-icon_active");
          console.error("Error removing like:", err);
        });
    } else {
      // LIKE
      api
        .addCardLike(data._id)
        .then(() => {
          cardLikeIcon.classList.add("card__like-icon_active");
        })
        .catch((err) => {
          cardLikeIcon.classList.add("card__like-icon_active");
          console.error("Error adding like:", err);
        });
    }
  });

  // Add like toggle functionality
  cardLikeIcon.addEventListener("click", () => {
    cardLikeIcon.classList.toggle("card__like-icon_active");
  });

  // When trash icon is clicked, open confirmation and store card info

  deleteButton.addEventListener("click", () => {
    cardDrop.classList.add("card-riddance__opened");
    cardToDelete = card;
    cardIdToDelete = data._id;
  });

  cardImage.addEventListener("click", () => {
    openPreviewModal(data);
  });

  return card;
}

confirmDeleteButton.addEventListener("click", () => {
  if (cardIdToDelete) {
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

cardClosedButton.addEventListener("click", () => {
  cardDrop.classList.remove("card-riddance__opened");
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

function resetValidation(editForm, inputs, button, settings) {
  // Placeholder: clear errors and reset button state
  inputs.forEach((input) => {
    input.setCustomValidity("");
    input.classList.remove("input-error");
  });
  button.disabled = false;
}

function handleAvatarForm(evt) {
  evt.preventDefault();
  const avatarLink = avatarInput.value;

  api
    .updateAvatar({ avatar: avatarLink })
    .then((userData) => {
      profileAvatar.src = userData.avatar;

      closeModal(avatarForm.closest(".modal"));
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    });
}

avatarForm.addEventListener("submit", handleAvatarForm);
avatarEditButton.addEventListener("click", () => {
  openModal(avatarForm.closest(".modal"));
});
