const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, setLike, remLike,
} = require('../controllers/cards');

cardsRouter.route('/cards')
  .get(getCards)
  .post(createCard);

cardsRouter.delete('/cards/:cardId', deleteCard);

cardsRouter.put('/cards/:cardId/likes', setLike);

cardsRouter.delete('/cards/:cardId/likes', remLike);

module.exports = cardsRouter;
