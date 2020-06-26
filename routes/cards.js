const cardsRouter = require('express').Router();
const path = require('path');
const cardsAll = require('../data/cards');

cardsRouter.get('/cards', (req, res) => {

  res.send(cardsAll);
});

module.exports = cardsRouter;