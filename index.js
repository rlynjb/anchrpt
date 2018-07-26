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

    this.nextPageToken = json.next_page_token ? json.next_page_token : null

    if (json.results) return json.results
    if (json.result) return json.result
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
