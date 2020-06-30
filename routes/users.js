const usersRouter = require('express').Router();
const usersAll = require('../data/users');

usersRouter.get('/users', (req, res) => {
  res.status(200).send(usersAll);
});

usersRouter.get('/users/:id', (req, res) => {
  const userId = usersAll.find((item) => item._id === req.params.id);// eslint-disable-line
  if (userId) {
    return res.status(200).send(userId);
  }
  return res.status(404).send({ message: 'Нет пользователя с таким id' });
});

module.exports = usersRouter;
