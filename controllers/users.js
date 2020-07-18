const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const getUsers = async (req, res) => {
  try {
    const usersAll = await User.find({});
    if (usersAll) {
      return res.status(200).send(usersAll);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
// eslint-disable-next-line consistent-return
const getUser = async (req, res) => {
  try {
    const userId = await User.findById(req.params.userId);
    if (userId) {
      res.status(200).send(userId);
    } else {
      throw new Error('Нет пользователя с таким id');
    }
  } catch (err) {
    if (err.message === 'Нет пользователя с таким id') {
      return res.status(404).send(err.message);
    }
    return res.status(400).send(err.message);
  }
};
// eslint-disable-next-line consistent-return
const createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    if (!password || password.length <= 3) {
      throw new Error('Пароль не введён или не корректен');
    }
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
    const uniq = err.message.includes('`email` to be unique');
    if (uniq) {
      return res.status(409).send(err.message);
    }
    if (err.name === 'Error' || err.name === 'ValidationError') {
      return res.status(400).send(err.message);
    }
    return res.status(500).send(err.message);
  }
};

const upUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!password || password.length <= 3) {
      throw new Error('Пароль не введён или не корректен');
    }
    const passHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passHash;
    const user = await User.findByIdAndUpdate(req.user._id, { name, password })
      .orFail(new Error('Нет пользователя с таким id'));
    return res.status(200).send(user);
  } catch (err) {
    if (err.message === 'Пароль не введён или не корректен') {
      return res.status(400).send(err.message);
    }
    if (err.message === 'Нет пользователя с таким id') {
      return res.status(404).send(err.message);
    }
    return res.status(500).send(err.message);
  }
};

const upAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar })
      .orFail(new Error('Нет пользователя с таким id'));
    return res.status(200).send(user);
  } catch (err) {
    if (err.message === 'Нет пользователя с таким id') {
      return res.status(404).send(err.message);
    }
    return res.status(500).send(err.message);
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email }).select('+password').orFail();
    const passTrue = await bcrypt.compare(password, userFound.password);
    if (!passTrue) {
      throw new Error('Неверный пароль');
    }
    const token = jwt.sign({ _id: userFound._id }, JWT_SECRET || 'some-secret-key', { expiresIn: '7d' });
    return res.status(200).send({ token });
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  upUser,
  upAvatar,
  login,
};
