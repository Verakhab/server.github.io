const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

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
    data: mongoose.Schema.Types.Buffer,
    contentType: mongoose.Schema.Types.String,
    // data: {
    //   type: mongoose.Schema.Types.Buffer,
    //   contentType: mongoose.Schema.Types.String,
    // },
    // validate: {
    //   validator: validator.isURL,
    //   message: 'Здесь должна быть ссылка',
    // },
    // required: [true, 'Это обязательное поле'],
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

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);
