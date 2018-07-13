const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./schema.js');
const { resolvers } = require('./resolvers.js');

const server = new ApolloServer({ 
  typeDefs, 
  resolvers
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
