const { ApolloServer, gql } = require('apollo-server');
const { typeDefs } = require('./schema.js');
const { resolvers } = require('./resolvers.js');

const fetch = require('node-fetch')

let connectors = {
  nextPageToken: null,
  get: async function(v) {
    const res = await fetch(v)
    const json = await res.json()
    if (json.status != 'OK') return false
    return json
  }
}

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: () => (connectors)
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
});
