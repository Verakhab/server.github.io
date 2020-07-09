const usersRouter = require('express').Router();
// const usersAll = require('../data/users');
const { getUser, getUsers, postUser } = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUser);

usersRouter.post('/users', postUser);

module.exports = usersRouter;
