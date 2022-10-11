const express = require('express');
const bodyParser = require('body-parser');

// graphqlHttp exports a valid middleware function, taking incomming requests, funnels them through graphql 
// query parser and auto-forwards to the correct resolvers
const { graphqlHTTP } = require('express-graphql');

// buildSchema will take a string and converts it to the required java script
const { buildSchema } = require('graphql');
const mongoose = require("mongoose");

const Event = require('./models/event')

const PORT = process.env.PORT || 4000;

const app = express();


// middleware to parse Json bodies
app.use(bodyParser.json());

// 
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
                events: [Event!]!
        }

        type RootMutation{
                createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootvalue: {
        events: () => {
           return Event.find()
            .then(events => {
                // use map to transform events returned into new object minus meta data
                return events.map(event => {
                    return { ...event._doc, _id: event.doc._id.toString()};
                });
            })
            .catch(err => {
                throw err;
            });
        },
        createEvent: args => {
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,
            //     date: args.eventInput.date,

            // };
            // console.log(args);
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
            });
            return event.save().then(result => {
                console.log(result);
                // use spread operator to return object minus meta data
                return {...result._doc, _id: result.doc._id.toString()};
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:
${process.env.MONGO_PASSWORD}
@cluster0.olaqxjp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
      });
}).catch(err => {
    console.log(err);
})
