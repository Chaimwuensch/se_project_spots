import "../pages/index.css";

import { Api } from "./Api.js";
import website_contacts from "../images/website-contacts.jpg";
import Trash_hover from "../images/Trash_hover.svg";
import Trash from "../images/Trash.svg";
import steps from "../images/steps.png";
import Logo from "../images/Logo.svg";
import Like_Icon from "../images/Like_Icon.svg";
import Liked_hover from "../images/Liked_hover.svg";
import Liked from "../images/Liked.svg";
// TODO: change names of group...
import Group_26 from "../images/Group_26.svg";
import Group_2 from "../images/Group_2.svg";
import close_hover from "../images/close_hover.svg";
import close from "../images/close.svg";
import avatar from "../images/avatar.jpg";
import achievements from "../images/achievements.svg";
import photo6 from "../images/6-photo-by-moritz-feldmann-from-pexels.jpg";
import photo5 from "../images/5-photo-by-van-anh-nguyen-from-pexels.jpg";
import photo4 from "../images/4-photo-by-maurice-laschet-from-pexels.jpg";
import photo3 from "../images/3-photo-by-tubanur-dogan-from-pexels.jpg";
import photo2 from "../images/2-photo-by-ceiline-from-pexels.jpg";
import photo1 from "../images/1-photo-by-moritz-feldmann-from-pexels.jpg";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    Authorization: "b33b9d1c-a249-4fd0-8745-28d5b0044be8",
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

cardDeleteButton.addEventListener("click", () => {
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

// Move this function to the top level, outside of any event listeners
function resetValidation(editForm, inputs, button, settings) {
  // Placeholder: clear errors and reset button state
  inputs.forEach((input) => {
    input.setCustomValidity("");
    input.classList.remove("input-error");
  });
  button.disabled = false;
}

document.querySelector(".header__logo").src = Logo;
document.querySelector(".profile__image").src = avatar;
document.querySelector(".profile__edit-icon").src = Group_2;
document.querySelector(".profile__post-icon").src = Group_26;
document.querySelector(".card-riddance__close").src = close;
document.querySelector(".profile__post-icon").src = Group_26;
document.querySelector(".profile__edit-icon").src = Group_2;
