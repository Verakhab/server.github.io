const express = require('express');
const path = require('path');
const {userRouter} = require('./routes/users');
const {usersRouter} = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(usersRouter);
app.use(userRouter);
app.use(cardsRouter);
app.use((req, res) => {
  res.status(404).send({ "message": "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {

  console.log('Hello, word!!!');
});
