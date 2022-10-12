const Post = require('../../models/Post');

module.exports = {
    Query: {
        // async to mitigate query failure
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}