const { model, Schema } = require('mongoose');
const dateFormat = require('../util/dateFormat');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    CreatedAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
});

module.exports = model('User', userSchema);