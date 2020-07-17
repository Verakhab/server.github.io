const usersRouter = require('express').Router();
const {
  getUser, getUsers, upUser, upAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUser);

usersRouter.patch('/users/me', upUser);

usersRouter.patch('/users/me/avatar', upAvatar);

module.exports = usersRouter;
