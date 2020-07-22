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
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};
// eslint-disable-next-line consistent-return
const deleteCard = async (req, res) => {
  try {
    const cardId = await Card.findById(req.params.cardId)
      .orFail();
    const cardOwner = cardId.owner.toString();
    if (req.user._id === cardOwner) {
      const remCard = await Card.findByIdAndRemove(cardId._id)
        .orFail();
      return res.status(200).send({ data: remCard });
    // eslint-disable-next-line no-else-return
    } else {
      return res.status(403).send({ message: 'Вы можете удалять карточки созданные вами' });
    }
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: err.message });
    }
    if (err.name === 'Error') {
      return res.status(403).send({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

const setLike = async (req, res) => {
  try {
    const arrLike = await Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true })
      .orFail();
    return res.status(200).send(arrLike);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

const remLike = async (req, res) => {
  try {
    const arrLike = await Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true })
      .orFail();
    return res.status(200).send(arrLike);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError ') {
      return res.status(404).send({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  remLike,
};
