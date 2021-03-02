const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, upUser, upAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), upUser);

usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/^(http(s)?:\/\/)(w{3}\.)?((\d+\.\d+\.\d+\.\d+)|(([A-Za-z\.-]{2,})\.([A-Za-z]{2,6})))((:\d{2,5})?\/?([\dA-Za-z\/]+#?))?/),
  }),
}), upAvatar);

module.exports = usersRouter;
