const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

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
  /* eslint-disable no-alert, no-console */
  console.info('Succesfully connected to MongoDB Database');
  /* eslint-enable no-alert, no-console */
});

connection.on('error', (err) => {
  /* eslint-disable no-alert, no-console */
  console.error(`Database Connection Error: ${err}`);
  /* eslint-enable no-alert, no-console */
  process.exitCode = 1;
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5f062e7e06cbcd398415d484',
  };

  next();
});
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
