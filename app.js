require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, errors, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const BadRequest = require('./middlewares/errors/bad-request-err');

const { PORT = 3000, URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { connection } = mongoose;

connection.on('open', () => {
  // eslint-disable-next-line no-console
  console.info('Succesfully connected to MongoDB Database');
});

connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`Database Connection Error: ${err.message}`);
  process.exitCode = 1;
});

app.use(helmet());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .send({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res
      .status(400)
      .send({ message: 'Передан некорректный Id' });
  }
  if (err.name === 'DocumentNotFoundError') {
    return res
      .status(404)
      .send({ message: err.message });
  }
  if (err.statusCode === '') {
    const {
      statusCode = '500',
      message = { message: 'Ошибка сервера' },
    } = err;
    return res
      .status(statusCode)
      .send(message);
  }
  return res
    .status(err.statusCode)
    .send({ message: err.message });
});

app.listen(PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port 3000');
});
