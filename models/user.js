const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const Unauthorized = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    minlength: [2, 'Должно быть от 2 до 30 символов'],
    maxlength: [30, 'Должно быть от 2 до 30 символов'],
    required: [true, 'Это обязательное поле'],
  },
  about: {
    type: mongoose.Schema.Types.String,
    minlength: [2, 'Должно быть от 2 до 30 символов'],
    maxlength: [30, 'Должно быть от 2 до 30 символов'],
    required: [true, 'Это обязательное поле'],
  },
  avatar: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator: validator.isURL,
      message: 'Здесь должна быть ссылка',
    },
    required: [true, 'Это обязательное поле'],
  },
  email: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator: validator.isEmail,
    },
    required: [true, 'Это обязательное поле'],
    unique: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Это обязательное поле'],
    select: false,
  },
});

userSchema.statics.validEmPass = function validEmPass(email, password) {
  if (!email || !password) {
    throw new Unauthorized('Пароль или email не заданы или не корректны');
  }
};

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);
