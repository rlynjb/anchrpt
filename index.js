const { ApolloServer, gql } = require('apollo-server');
//const { typeDefs } = require('./schema.js');
const { resolvers } = require('./resolvers.js');

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  
  type Place {
    id: String,
    title: String,
    images: [String],
    price: Int,
    open_hours: [OpenHours],
    category: [String],
    description: String,
    location: Location,
    website: String
  }
  
  type OpenHours {
    date: String,
    time: [Time]
  }
  
  type Time {
    start: String,
    end: String
  }
  
  type Location {
    address: String,
    zipcode: String,
    city: String,
    state: String,
    country: String
  }

  type Query {
    books: [Book],
    places: [Place]
  }
`;

const server = new ApolloServer({ 
  typeDefs, 
  resolvers
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
