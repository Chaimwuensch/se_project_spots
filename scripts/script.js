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

const newPostButton = document.querySelector(".profile__post-button");
const editCardModal = document.querySelector("#add-card-modal");
const editProfileModal = document.querySelector("#edit-modal");
const profileName = document.querySelector(".profile__name");
const profileTitle = document.querySelector(".profile__title");
const profileInputName = editProfileModal.querySelector("#name");
const profileInputTitle = editProfileModal.querySelector("#description");
const profileEditButton = document.querySelector(".profile__edit-button");
const editForm = editProfileModal.querySelector(".modal__form");
const cardForm = editCardModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card__template");
const editModalCloseButton =
  editProfileModal.querySelector(".modal__close-btn");
const cardSection = document.querySelector(".cards");
const editCardCloseButton = editCardModal.querySelector(".modal__close-btn");
const cardNameInput = editCardModal.querySelector("#add-card-name");
const cardLinkInput = editCardModal.querySelector("#add-card-link");
const addCardForm = document.querySelector('.popup__form[name="new-card"]');

function getCard(data) {
  const card = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardName = card.querySelector(".card__title");
  const cardImage = card.querySelector(".card__image");
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardName.textContent = data.name;
  return card;
}

function handleAddCardForm(evt) {
  evt.preventDefault();
  const title = cardNameInput.value;
  const link = cardLinkInput.value;

  const cardData = {
    name: title,
    link: link,
  };

  const newCard = getCard(cardData);

  cardSection.prepend(newCard);

  cardForm.reset();
  closeModal(editCardModal);
}
function openModal(modal) {
  modal.classList.add("modal_opened");
}
profileEditButton.addEventListener("click", () => openModal(editProfileModal));

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditForm(evt) {
  evt.preventDefault();
  profileName.textContent = profileInputName.value;
  profileTitle.textContent = profileInputTitle.value;
  closeModal();
}

editModalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

editCardCloseButton.addEventListener("click", () => {
  profileInputName.value = profileName.textContent;
  profileInputTitle.value = profileTitle.textContent;
  closeModal(editCardModal);
});

newPostButton.addEventListener("click", () => openModal(editCardModal));

editForm.addEventListener("submit", handleEditForm);
cardForm.addEventListener("submit", handleAddCardForm);

initialCards.forEach((item) => {
  const positioning = getCard(item);
  cardSection.prepend(positioning);
});
