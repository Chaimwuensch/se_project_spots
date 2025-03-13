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

const editProfileModal = document.querySelector("#edit-modal");
const profileName = document.querySelector(".profile__name");
const profileTitle = document.querySelector(".profile__title");
const profileInputName = editProfileModal.querySelector("#name");
const profileInputTitle = editProfileModal.querySelector("#description");
const profileEditButton = document.querySelector(".profile__edit-button");
const editForm = editProfileModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card__template");
const editModalCloseButton =
  editProfileModal.querySelector(".modal__close-btn");
const allCards = document.querySelector(".cards");

function getCard(data) {
  const card = cardTemplate.content
    .querySelector(".card__template")
    .cloneNode(true);
  const cardName = card.querySelector(".card__title");
  cardName.textContent = data.name;
  return card;
}
function openModal() {
  profileInputName.value = profileName.textContent;
  profileInputTitle.value = profileTitle.textContent;
  editProfileModal.classList.add("modal__opened");
}
profileEditButton.addEventListener("click", openModal);

function closeModal() {
  editProfileModal.classList.remove("modal__opened");
}

function handleEditForm(evt) {
  evt.preventDefault();
  profileName.textContent = profileInputName.value;
  profileTitle.textContent = profileInputTitle.value;
  closeModal();
}

editModalCloseButton.addEventListener("click", closeModal);
editForm.addEventListener("submit", handleEditForm);

for (let i = 0; i < initialCards.length; i++) {
  const positioning = getCard(initialCards[i]);
  allCards.prepend(positioning);
}
