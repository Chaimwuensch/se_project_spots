import "../pages/index.css";
import { Api } from "./Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    Authorization: "3cb1dd41-d6bf-4a34-9433-4976f12dd05e",

    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileName.textContent = userData.name;
    profileTitle.textContent = userData.about;

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
const avatarEditButton = document.querySelector(".profile__avatar-edit-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = document.querySelector('form[name="edit-avatar"]');
const avatarInput = document.querySelector("#avatar-link-input");
const profileImage = document.querySelector(".profile__image");

let cardToDelete = null;
let cardIdToDelete = null;

function setButtonLoading(button, isLoading, loadingText = "Saving…") {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    if (button.dataset.originalText !== undefined) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
    button.disabled = false;
  }
}

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

  cardLikeIcon.addEventListener("click", () => {
    cardLikeIcon.classList.toggle("card__like-icon_active");
  });

  deleteButton.addEventListener("click", () => {
    openModal(cardDrop);
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
    const button = confirmDeleteButton;
    setButtonLoading(button, true, "Deleting…");
    api
      .removeCard({ cardID: cardIdToDelete })
      .then(() => {
        if (cardToDelete) cardToDelete.remove();
        closeModal(cardDrop);
        cardToDelete = null;
        cardIdToDelete = null;
      })
      .catch((error) => console.error("Error deleting card:", error))
      .finally(() => setButtonLoading(button, false));
  } else if (cardToDelete) {
    cardToDelete.remove();
    closeModal(cardDrop);
    cardToDelete = null;
  }
});

cardCancelButton.addEventListener("click", () => {
  closeModal(cardDrop);
  cardToDelete = null;
  cardIdToDelete = null;
});

cardClosedButton.addEventListener("click", () => {
  closeModal(cardDrop);
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
  const submitBtn = editForm.querySelector(".modal__submit-btn");
  setButtonLoading(submitBtn, true, "Saving...");
  api
    .editUserInfo({ name, about })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileTitle.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Failed to update profile:", err);
    })
    .finally(() => setButtonLoading(submitBtn, false));
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
  const submitBtn = cardForm.querySelector(".modal__submit-btn");
  setButtonLoading(submitBtn, true, "Saving...");
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
    })
    .finally(() => setButtonLoading(submitBtn, false));
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
  inputs.forEach((input) => {
    input.setCustomValidity("");
    input.classList.remove("input-error");
  });
  button.disabled = false;
}

function handleAvatarForm(evt) {
  evt.preventDefault();
  const avatarLink = avatarInput.value;
  const submitBtn = avatarForm.querySelector(".modal__submit-btn");
  setButtonLoading(submitBtn, true, "Saving...");
  api
    .editAvatar({ avatar: avatarLink })
    .then((userData) => {
      profileImage.src = userData.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    })
    .finally(() => setButtonLoading(submitBtn, false));
}

avatarForm.addEventListener("submit", handleAvatarForm);
avatarEditButton.addEventListener("click", () => {
  avatarInput.value = "";
  const submitButton = avatarForm.querySelector(".modal__submit-btn");
  resetValidation(avatarForm, [avatarInput], submitButton, settings);
  openModal(avatarModal);
});
