const Card = require('../models/card');
// eslint-disable-next-line consistent-return
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send(err.message));
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
// eslint-disable-next-line consistent-return
const deleteCard = async (req, res) => {
  try {
    const cardId = await Card.findById(req.params.cardId).orFail(new Error('Нет карточки с таким id'));
    const cardOwner = cardId.owner;
    if (req.user._id === cardOwner) {
      const remCard = await Card.findByIdAndRemove(cardId._id).orFail(new Error());
      return res.status(200).send({ data: remCard });
    // eslint-disable-next-line no-else-return
    } else {
      throw new Error('Вы можете удялять карточки только созданные вами');
    }
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return res.status(500).send(err.message);
    }
    if (err.message === 'Вы можете удялять карточки только созданные вами') {
      return res.status(403).send(err.message);
    }
    if (err.message === 'Нет карточки с таким id') {
      return res.status(404).send(err.message);
    }
    return res.status(400).send(err.message);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
