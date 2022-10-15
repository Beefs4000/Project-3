const { model, Schema } = require('mongoose');
const dateFormat = require('../util/dateFormat');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
}, { timestamps: true
});

module.exports = model('User', userSchema);