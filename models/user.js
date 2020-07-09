const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    minlength: [2, 'Должно быть от 2 до 30 символов'],
    maxlength: [30, 'Должно быть от 2 до 30 символов'],
    required: true,
    message: 'Это обязательное поле',
  },
  about: {
    type: mongoose.Schema.Types.String,
    minlength: [2, 'Должно быть от 2 до 30 символов'],
    maxlength: [30, 'Должно быть от 2 до 30 символов'],
    required: true,
    message: 'Это обязательное поле',
  },
  avatar: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator: (v) => /^(http(s)?:\/\/)/.test(v),
      message: 'Здесь должна быть ссылка',
    },
    required: true,
    message: 'Это обязательное поле',
  },
});

module.exports = mongoose.model('user', userSchema);
