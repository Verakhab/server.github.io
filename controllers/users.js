const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/unauthorized-err');
const ConflictingRequest = require('../errors/conflicting-request-err');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

// eslint-disable-next-line consistent-return
const getUsers = async (req, res, next) => {
  try {
    const usersAll = await User.find({})
      .orFail();
    return res.status(200).send(usersAll);
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const getUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const userId = await User.findById(id)
      .orFail();
    res.status(200).send(userId);
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const userNew = await User.create({
      name, about, avatar, email, password: passHash,
    });
    if (userNew) {
      return res.status(201).send(userNew);
    }
  } catch (err) {
    if (err.errors.email && err.errors.email.kind === 'unique') {
      return next(new ConflictingRequest('Такой email уже существует'));
    }
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const upUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about },
      { new: true, runValidators: true })
      .orFail();
    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const upAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, avatar,
      { new: true, runValidators: true })
      .orFail();
    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email }).select('+password');
    if (userFound === null) {
      throw new Unauthorized('Пароль или email не заданы или не корректны');
    }
    const isPass = await bcrypt.compare(password, userFound.password);
    if (!isPass) {
      throw new Unauthorized('Пароль или email не заданы или не корректны');
    }
    const token = jwt.sign({ _id: userFound._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
      { expiresIn: '7d' });
    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   sameSite: true,
    // });
    return res.status(200).send({ token },
      userFound._id,
      userFound.name,
      userFound.about,
      userFound.avatar);
  } catch (err) {
    next(err);
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
