const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const getUsers = async (req, res) => {
  try {
    const usersAll = await User.find({})
      .orFail(new Error('Ошибка сервера'));
    return res.status(200).send(usersAll);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
// eslint-disable-next-line consistent-return
const getUser = async (req, res) => {
  try {
    const userId = await User.findById(req.params.userId)
      .orFail(new Error('Нет пользователя с таким id'));
    res.status(200).send(userId);
  } catch (err) {
    if (err.name === 'Error') {
      return res.status(404).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};
// eslint-disable-next-line consistent-return
const createUser = async (req, res) => {
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
    const uniq = err.message.includes('`email` to be unique');
    if (uniq) {
      return res.status(409).send(err.message);
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

const upUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about },
      { new: true, runValidators: true })
      .orFail(new Error('Нет пользователя с таким id'));
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'Error') {
      return res.status(404).send({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

const upAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar },
      { new: true, runValidators: true })
      .orFail(new Error('Нет пользователя с таким id'));
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'Error') {
      return res.status(404).send({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email }).select('+password')
      .orFail(new Error('Пароль или email не заданы'));
    const isPass = await bcrypt.compare(password, userFound.password);
    if (!isPass) {
      throw new Error('Пароль или email не заданы');
    }
    const token = jwt.sign({ _id: userFound._id },
      JWT_SECRET || 'some-secret-key',
      { expiresIn: '7d' });
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send({ token });
  } catch (err) {
    res.status(401).send({ message: err.message });
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
