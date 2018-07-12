//import fetch from 'node-fetch';
const fetch = require('node-fetch');
const typeDefs = require('./schema.js')
const resolvers = require('./resolvers.js')

const { ApolloServer, gql } = require('apollo-server');

const server = new ApolloServer({ 
  typeDefs, 
  resolvers
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
