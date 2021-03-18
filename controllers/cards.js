const Card = require('../models/card');
const Forbidden = require('../errors/forbidden-err');
// eslint-disable-next-line consistent-return
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({})
      .orFail();
    const cardsBase64 = cards.map(card => {
      const name = card.name;
      const image = card.image.data.toString('base64');
      const imageType = card.image.contentType;
      const likes = card.likes;
      const owner = card.owner;
      const createdAt = card.createdAt;
      const _id = card._id;
      return {
        name, image, imageType, likes, owner, createdAt, _id
      };
    });
      return res.send(cardsBase64)
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const createCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name } = req.body;
    const image = {
      data: new Buffer.from(req.file.buffer, 'base64'),
      contentType: req.file.mimetype,
    };
    const cardNew = await Card.create({ name, image, owner: _id });
    const imageCard = cardNew.image.data.toString('base64');
    const imageType = cardNew.image.contentType;
    const idCard = cardNew._id;
    const {
      createdAt, likes, owner
    } = cardNew;
    const card = {
      name, imageCard, imageType, likes, owner, createdAt, idCard
    }
    return res.send(card);
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const deleteCard = async (req, res, next) => {
  const id = req.params.cardId;
  try {
    const cardId = await Card.findById(id)
      .orFail();
    const cardOwner = cardId.owner.toString();
    if (req.user._id !== cardOwner) {
      throw new Forbidden('Вы можете удалять карточки созданные только вами');
    } else {
      const remCard = await Card.findByIdAndRemove(cardId._id)
        .orFail();
      return res.send(remCard);
    }
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const setLike = async (req, res, next) => {
  const id = req.params.cardId;
  try {
    const arrLike = await Card.findByIdAndUpdate(id,
      { $addToSet: { likes: req.user._id } },
      { new: true })
      .orFail();
    return res.send(arrLike);
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const remLike = async (req, res, next) => {
  const id = req.params.cardId;
  try {
    const arrLike = await Card.findByIdAndUpdate(id,
      { $pull: { likes: req.user._id } },
      { new: true })
      .orFail();
    return res.send(arrLike);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  remLike,
};
