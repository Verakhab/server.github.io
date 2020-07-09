const Card = require('../models/card');

const getCards = (req, res) => {
  try {
    Card.find({})
      .populate('owner')
      .then((cards) => res.send({ data: cards }))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).send(err);
  }
};

const createCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const cardNew = await Card.create({ name, link, owner: _id });
    res.status(200).send(cardNew);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err);
    }
    res.status(500).send(err);
  }
};

const deleteCard = async (req, res) => {
  try {
    const cardIdd = await Card.findById(req.params.cardId);
    Card.findByIdAndRemove(cardIdd)
      .then((cardIdi) => res.send({ data: cardIdi }))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
