const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getUsers = async (req, res) => {  // eslint-disable-line
  try {
    const usersAll = await User.find({});
    if (usersAll) {
      return res.status(200).send(usersAll);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

const getUser = async (req, res) => {  // eslint-disable-line
  try {
    const userId = await User.findById(req.params.userId);
    if (userId) {
      return res.status(200).send(userId);
    }
  } catch (err) {
    return res.status(404).send({ message: 'Нет пользователя с таким id' });
  }
};

const createUser = async (req, res) => {  // eslint-disable-line
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const userNew = await User.create({
      name, about, avatar, email, password: passHash,
    });
    if (userNew) {
      return res.status(200).send({
        name, about, avatar, email,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send(err);
    }
    return res.status(500).send(err);
  }
};

const login = async (req, res) => {  // eslint-disable-line
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email }).select('+password').orFail();
    const passTrue = await bcrypt.compare(password, userFound.password);
    if (!passTrue) {
      throw new Error();
    }
    const token = jwt.sign({ _id: userFound._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.status(200).send({ token });
  } catch (err) {
    res.status(401).send({ err });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
