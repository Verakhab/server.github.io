const Card = require('../models/card');

const getCards = (req, res) => {  // eslint-disable-line
  try {
    Card.find({})
      .populate('owner')
      .then((cards) => res.send({ data: cards }))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    return res.status(500).send(err);
  }
};

const createCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const cardNew = await Card.create({ name, link, owner: _id });
    return res.status(200).send(cardNew);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send(err);
    }
    return res.status(500).send(err);
  }
};

const deleteCard = async (req, res) => {
  try {
    const cardId = await Card.findByIdAndDelete(req.params.cardId).orFail();
    return res.status(200).send({ data: cardId });
  } catch (err) {
    return res.status(404).send({ message: 'Нет карточки с таким id' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
