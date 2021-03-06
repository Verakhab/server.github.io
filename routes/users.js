const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, upUser, upAvatar,
} = require('../controllers/users');

usersRouter.get('/user', getUser);

usersRouter.get('/users', getUsers);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), upUser);

usersRouter.patch('/users/me/avatar', upAvatar);

module.exports = usersRouter;

// .string().regex(/^(http(s)?:\/\/)(w{3}\.)?((\d+\.\d+\.\d+\.\d+)|(([A-Za-z\.-]{2,})\.([A-Za-z]{2,6})))((:\d{2,5})?\/?([\dA-Za-z\/]+#?))?/)
// celebrate({
//   body: Joi.object().keys({
//     // eslint-disable-next-line no-useless-escape
//     avatar: Joi.required(),
//   }),
// }),
