const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            CreatedAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    // Link to user model to get specific user
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema);

