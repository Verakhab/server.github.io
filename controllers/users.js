const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const usersAll = await User.find({});
    if (usersAll) {
      res.status(200).send(usersAll);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const getUser = async (req, res) => { // eslint-disable-line
  try {
    const userId = await User.findById(req.params.userId);
    if (userId) {
      return res.status(200).send(userId);
    }
  } catch (err) {
    return res.status(404).send({ message: 'Нет пользователя с таким id' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const userNew = await User.create({ name, about, avatar });
    if (userNew) {
      res.status(200).send(userNew);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err);
    }
    res.status(500).send(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
