const usersRouter = require('express').Router();
const userRouter = require('express').Router();
const path = require('path');
const usersAll = require('../data/users');

usersRouter.get('/users', (req, res) => {

res.send(usersAll);
});

userRouter.get('/users/:id', (req, res) => {

  usersAll.forEach((item) => {

    if (item._id === req.params.id) {

      return res.status(200).send(item);
    } else {

      res.status(404).send({ "message": "Нет пользователя с таким id" });
    }
  });
});

module.exports = {
  usersRouter,
  userRouter
};