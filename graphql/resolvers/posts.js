const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth')

module.exports = {
    Query: {
        // async to mitigate query failure
        async getPosts() {
            try {
                // Get posts sorted by date entered (latest 1st)
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        // get single post by ID
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            // console.log(user);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty')
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: user.createdAt
            });

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            // Make's sure autherized user can delete post
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return 'Yak deleted successfully';
                } else {
                    throw new AuthenticationError('Yo, not your Yak to Yik!!')
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context)

            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // Post already likes, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                    await post.save();
                } else {
                    //    not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            } else throw new UserInputError('Post not found')
        }
    }
}