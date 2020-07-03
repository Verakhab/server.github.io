const cardsRouter = require('express').Router();
const cardsAll = require('../data/cards');

cardsRouter.get('/cards', (req, res) => {
  res.status(200).send(cardsAll);
});

module.exports = cardsRouter;
