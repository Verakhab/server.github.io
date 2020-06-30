import {
  Api
} from './Api';
import {
  serverUrl,
  tokenApi,
  errorCollection
} from '../index';

import {
  Card
} from './Card';


export class CardList { // класс отрисовки существующих карт и добавления новых
  constructor(container) {
      this.container = container;
  }

  addCard(name, link, likes) {
      const card = {
          name,
          link,
          likes,
      };

      const cardJSON = JSON.stringify(card);
      const aCard = new Api(`${serverUrl}cards`, tokenApi)
          .postCard(cardJSON)
          .then((res) => {
              const addButton = document.querySelector('.popup__button');
              addButton.textContent = errorCollection.plus;
              console.log(res);
              const newCard = new Card(this.container, name, link, likes, res._id);
              newCard.renderCard();
          });
  }

  render() {
      const loadCards = new Api(`${serverUrl}cards`, tokenApi)
          .getInitialCards()
          .then((cards) => {
              cards.forEach((e) => {
                  const newCard = new Card(this.container, e.name, e.link, e.likes, e._id);
                  newCard.renderCard();
              });
          });
  }
}