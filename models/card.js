const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    minlength: [2, 'Должно быть от 2 до 30 символов'],
    maxlength: [30, 'Должно быть от 2 до 30 символов'],
    required: [true, 'Это обязательное поле'],
  },
  link: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator: (v) => /^(http(s)?:\/\/)/.test(v),
      message: 'Здесь должна быть ссылка',
    },
    required: [true, 'Это обязательное поле'],
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
