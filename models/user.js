const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: mongoose.Schema.Types.String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: mongoose.Schema.Types.String,
    validate: {
      /* eslint no-underscore-dangle: ["error",{ "allow": ["\.", "\/"] }] */
      validator: (v) => /^(http(s)?:\/\/)/.test(v),  // eslint-disable-line
    },
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
