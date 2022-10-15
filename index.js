const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGO_DB } = require('./config');


const PORT = process.env.PORT || 3001;


// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // This will allow 
    context: ({ req }) => ({ req })
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