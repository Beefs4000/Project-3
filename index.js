const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const Post = require('./models/Post')
const { MONGO_DB } = require('./config');


const PORT = process.env.PORT || 3001;

const typeDefs = gql`
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }

    type Query{
        getPosts: [Post]
    }
`;

const resolvers = {
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

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGO_DB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
        return server.listen({ port: PORT });
    })
    .then(res => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })