//import fetch from 'node-fetch';
const fetch = require('node-fetch');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const { ApolloServer, gql } = require('apollo-server');

const server = new ApolloServer({ 
  typeDefs, 
  resolvers
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
