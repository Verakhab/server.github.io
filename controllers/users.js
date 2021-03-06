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
    const userBase64 = usersAll.map(user => {
      const name = user.name;
      const about = user.about;
      const avatar = user.avatar.data.toString('base64');
      const avatarType = user.avatar.contentType;
      const email = user.email;
      const _id = user._id;
      return {
        name, about, avatar, avatarType, email, _id
      };
    });
    return res.send(userBase64);
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const getUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const userId = await User.findById(_id)
      .orFail();
    const avatar = userId.avatar.data.toString('base64');
    const avatarType = userId.avatar.contentType;
    const {
      name, about, email
    } = userId;
    return res.send({
      name, about, avatar, avatarType, email, _id
    });
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
// проверить наличие файла
const createUser = async (req, res, next) => {
  try {
    const {
      name, about, email, password,
    } = req.body;
    const avatar = {
      data: new Buffer.from(req.file.buffer, 'base64'),
      contentType: req.file.mimetype,
    };
    const passHash = await bcrypt.hash(password, 10);
    const userNew = await User.create({
      name, about, avatar, email, password: passHash,
    });
    if (userNew) {
      const ava = userNew.avatar.data.toString('base64');
      const { _id } = userNew;
      return res.status(201).send({
        _id, name, about, ava, email,
      });
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
    const avatar = user.avatar.data.toString('base64');
    const avatarType = user.avatar.contentType;
    const {
      email, _id
    } = user
    return res.send({
      name, about, avatar, avatarType, email, _id
    });
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
// проверить наличие файла
const upAvatar = async (req, res, next) => {
  try {
    const avatar = {
      data: new Buffer.from(req.file.buffer, 'base64'),
      contentType: req.file.mimetype,
    };
    const user = await User.findByIdAndUpdate(req.user._id, { avatar },
      { new: true })
      .orFail();
    const ava = user.avatar.data.toString('base64');
    const avatarType = user.avatar.contentType;
    const userNew = {
      ava,
      avatarType,
    };
    return res.send(userNew);
  } catch (err) {
    next(err);
  }
};
// req.body, runValidators: true }
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
    const tok = jwt.sign({ _id: userFound._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
      { expiresIn: '7d' });
    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   sameSite: true,
    // });
    const ava = userFound.avatar.data.toString('base64');
    const avatarType = userFound.avatar.contentType;
    userFound.token = tok;
    const {
      token, _id, name, about,
    } = userFound;
    const userBase64 = {
      token,
      _id,
      name,
      about,
      ava,
      avatarType,
    };
    return res.send(userBase64);
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
