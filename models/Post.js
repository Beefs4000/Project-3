const { model, Schema } = require('mongoose');
const dateFormat = require('../util/dateFormat');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
      },
    comments: [
        {
            body: String,
            username: String,
            CreatedAt: {
                type: Date,
                default: Date.now,
                get: (timestamp) => dateFormat(timestamp),
              },
        }
    ],
    likes: [
        {
            username: String,
            createdAt: {
                type: Date,
                default: Date.now,
                get: (timestamp) => dateFormat(timestamp),
              },
        }
    ],
    // Link to user model to get specific user
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema);

