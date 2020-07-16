require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(URL || 'mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { connection } = mongoose;

connection.on('open', () => {
  /* eslint-disable no-console */
  console.info('Succesfully connected to MongoDB Database');
  /* eslint-enable no-console */
});

connection.on('error', (err) => {
  /* eslint-disable no-console */
  console.error(`Database Connection Error: ${err.message}`);
  /* eslint-enable no-console */
  process.exitCode = 1;
});

app.use(helmet());

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT || 3000, () => {
  /* eslint-disable no-console */
  console.log('Server is running on port 3000');
  /* eslint-enable no-console */
});
