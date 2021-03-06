const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    minlength: [2, 'Должно быть от 2 до 30 символов'],
    maxlength: [30, 'Должно быть от 2 до 30 символов'],
    required: [true, 'Это обязательное поле'],
  },
  image: {
    data: mongoose.Schema.Types.Buffer,
    contentType: mongoose.Schema.Types.String,
    // type: mongoose.Schema.Types.String,
    // validate: {
    //   validator: validator.isURL,
    //   message: 'Здесь должна быть ссылка',
    // },
    // required: [true, 'Это обязательное поле'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Это обязательное поле'],
  },
  likes: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
