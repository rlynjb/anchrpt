//import fetch from 'node-fetch';
const fetch = require('node-fetch');
const s = require('./schema.js');
const r = require('./resolvers.js');

const { ApolloServer, gql } = require('apollo-server');

const server = new ApolloServer({ 
  s.typeDefs, 
  r.resolvers
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
