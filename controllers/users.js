const user = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const usersAll = await user.find({});
    if (usersAll) {
      res.status(200).send(usersAll);
    }
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
    res.status(500).send({ error: 'Error 500' });
  }
};

const getUser = async (req, res) => { // eslint-disable-line
  try {
    const userId = await user.findById(req.params.userId);
    if (userId) {
      return res.status(200).send(userId);
    }
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
    return res.status(404).send({ message: 'Нет пользователя с таким id' });
  }
};

const postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const userNew = await user.create({ name, about, avatar });
    if (userNew) {
      res.status(200).send(userNew);
      /* eslint-disable no-console */
      console.log('Пользователь создан!');
      /* eslint-enable no-alert, no-console */
    }
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
    res.status(500).send({ message: 'Произошла ошибка!' });
  }
};

module.exports = {
  getUsers,
  getUser,
  postUser,
};
