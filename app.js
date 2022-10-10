const express = require('express');
const bodyParser = require('body-parser');
// buildSchema will take a string and converts it to the required java script
const { buildSchema } = require('graphql');

// graphqlHttp exports a valid middleware function, taking incomming requests, funnels them through graphql 
// query parser and auto-forwards to the correct resolvers
const graphqlHttp = require('express-graphql');


const PORT = process.env.PORT || 3001;

const app = express();

// middleware to parse Json bodies
app.use(bodyParser.json());

// 
app.use(
    '/graphql', 
    graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
                events: [String!]!
        }

        type RootMutation{
                createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootvalue: {
        events: () => {
            return ['Romantic cooking', 'Sailng', 'All-Night Coding'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });