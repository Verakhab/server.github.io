import {
  userNameInput,
  serverUrl,
  tokenApi,
  root,
  errorCollection,
  placesList,
} from '../index';
import {
  Api
} from './Api';
import Close from './../images/close.svg';

export class Card { // класс создания карточки, лайка и удаления
  constructor(container, name, link, likes, id) {
      this.container = container;
      this.name = name;
      this.link = link;
      this.likes = likes;
      this.id = id;
      this.card = null;
      this.removeCard = this.removeCard.bind(this);
      this.like = this.like.bind(this);
      this.openImage = this.openImage.bind(this);
      this.createElem = this.createElem.bind(this);
  }

  createElem(tagName, className) { // создание элемента
      const elem = document.createElement(tagName);
      elem.classList.add(className);

      return elem;
  }

  create() {
      const placesCard = this.createElem('div', 'place-card');

      const cardImage = this.createElem('div', 'place-card__image');
      cardImage.setAttribute('style', `background-image: url(${this.link})`);
      placesCard.appendChild(cardImage);

      const buttonDeleteIcon = this.createElem('button', 'place-card__delete-icon');
      cardImage.appendChild(buttonDeleteIcon);

      const cardDescription = this.createElem('div', 'place-card__description');
      placesCard.appendChild(cardDescription);

      const cardName = this.createElem('h3', 'place-card__name');
      cardName.textContent = this.name;
      cardDescription.appendChild(cardName);

      const buttonLike = this.createElem('button', 'place-card__like-icon');
      const likeActive = this.likes;

      likeActive.forEach((item) => {
          if (item.name === userNameInput.value) {
              buttonLike.classList.add('place-card__like-icon_liked');
          }
      });

      const caseLikeCount = this.createElem('div', 'place-card__case');
      cardDescription.appendChild(caseLikeCount);

      const likeCount = this.createElem('div', 'place-card__counter');
      likeCount.textContent = this.likes.length;
      caseLikeCount.appendChild(buttonLike);
      caseLikeCount.appendChild(likeCount);

      return placesCard;
  }

  renderCard() { // добавить карточку
      this.card = this.create();
      this.container.appendChild(this.card);
      this.addListeners();
  }

  like(e) { // лайкнуть карточку
      if (e.target.classList.contains('place-card__like-icon_liked')) {
          e.target.classList.toggle('place-card__like-icon_liked');
          const loadObj = new Api(`${serverUrl}cards/like/${this.id}`, tokenApi)
              .deleteLikeCard()
              .then((info) => {
                  e.target.nextElementSibling.textContent = info.likes.length;
                  console.log(info.likes);
              });
      } else {
          e.target.classList.toggle('place-card__like-icon_liked');
          const loadObj = new Api(`${serverUrl}cards/like/${this.id}`, tokenApi)
              .likeCard()
              .then((info) => {
                  e.target.nextElementSibling.textContent = info.likes.length;
                  console.log(info.likes);
              });
      }
  }

  removeCard(e) { // удалить карточку
      e.stopPropagation();

      const removeCard = new Api(`${serverUrl}cards/${this.id}`, tokenApi)
          .reCard()
          .then((res) => {
              if (window.confirm(errorCollection.remove)) {
                  console.log(res);
                  placesList.removeChild(e.target.closest('.place-card'));
              }
          });
  }

  openImage(e) {
      const a = e.target.getAttribute('style');
      const b = a.slice(22, -1);
      const darkLayer = this.createElem('div', 'dark-layer');
      root.appendChild(darkLayer);

      const divChild = this.createElem('div', 'dark-layer_child');
      darkLayer.appendChild(divChild);

      const imageMax = this.createElem('div', 'place-card__image');
      imageMax.classList.add('place-card__image_max');
      imageMax.setAttribute('style', `background-image: url(${b})`);
      darkLayer.appendChild(imageMax);

      const imageClose = this.createElem('img', 'popup__close-image');
      imageClose.setAttribute('src', `${Close}`);
      imageMax.appendChild(imageClose);

      imageClose.addEventListener('click', () => {
          root.removeChild(darkLayer);
      });
  }

  addListeners() {
      this.card
          .querySelector('.place-card__like-icon')
          .addEventListener('click', this.like);

      this.card
          .querySelector('.place-card__delete-icon')
          .addEventListener('click', this.removeCard);

      this.card
          .querySelector('.place-card__image')
          .addEventListener('click', this.openImage);
  }
}
