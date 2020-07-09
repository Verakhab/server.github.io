const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator: (v) => /^(http(s)?:\/\/)/.test(v),  // eslint-disable-line
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
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
