const card = require('../models/card');

const getCards = (req, res) => {
  try {
    card.find({})
      .populate('user')
      .then((cards) => res.send({ data: cards }))
      .catch((err) => res.status(500).send({ message: 'Произошла ошибка!!!', err }));
  } catch (e) {
    console.log(e); // eslint-disable-line
    res.status(500).send({ message: 'Произошла ошибка!!!', e });
  }
};

const createCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const cardNew = await card.create({ name, link, owner: _id });
    res.status(200).send(cardNew);
  } catch (e) {
    console.log(e); // eslint-disable-line
    res.status(500).send({ message: 'Произошла ошибка!!!', e });
  }
};

const deleteCard = async (req, res) => {
  try {
    const cardIdd = await card.findById(req.params.cardId);
    card.findByIdAndRemove(cardIdd)
      .then((cardIdi) => res.send({ data: cardIdi }))
      .catch((err) => res.status(500).send({ message: 'Произошла ошибка!!!', err }));
  } catch (e) {
    console.log(e); // eslint-disable-line
    res.status(500).send({ message: 'Произошла ошибка!!!', e });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
