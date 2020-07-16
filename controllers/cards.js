const Card = require('../models/card');
// eslint-disable-next-line consistent-return
const getCards = (req, res) => {
  try {
    Card.find({})
      .then((cards) => res.send({ data: cards }))
      .catch((err) => res.status(500).send(err.message));
  } catch (err) {
    return res.status(500).send(err.message);
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
      return res.status(400).send(err.message);
    }
    return res.status(500).send(err.message);
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
