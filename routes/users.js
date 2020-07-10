const usersRouter = require('express').Router();
const { getUser, getUsers, createUser } = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUser);

usersRouter.post('/users', createUser);

module.exports = usersRouter;
