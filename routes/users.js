const usersRouter = require('express').Router();
const usersAll = require('../data/users');

usersRouter.get('/users', (req, res) => {
  res.status(200).send(usersAll);
});

usersRouter.get('/users/:id', (req, res) => {
  /* eslint no-underscore-dangle: ["error",{ "allow": ["_id"] }] */
  const userId = usersAll.find((item) => item._id === req.params.id);
  if (userId) {
    return res.status(200).send(userId);
  }
  return res.status(404).send({ message: 'Нет пользователя с таким id' });
});

module.exports = usersRouter;
