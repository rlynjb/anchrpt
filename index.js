//import fetch from 'node-fetch';
const fetch = require('node-fetch');

const { ApolloServer, gql } = require('apollo-server');

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

/* 
  https://developers.google.com/places/web-service/search
*/
let nearbySearchApi = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=36.057726,-115.237187&keyword=bar,bars&type=bar&radius=80000&maxprice=2&key=AIzaSyBd0gI0OszcB1VkKFSD0jLbqKleC98N5tY'

const resolvers = {
  Query: {
    places: () => {
      let finalData = []

      fetch( nearbySearchApi )
        .then(res => res.json())
        .then(json => {
          if (json.status != 'OK') return false

          json.results.forEach( i => {
            finalData.push({ title: i.name })
          })
          
          console.log(finalData)
          return finalData
        })
    },

    books: () => {
      return [
        {
          title: 'Harry Potter and the Chamber of Secrets',
          author: 'J.K. Rowling',
        },
        {
          title: 'Jurassic Park',
          author: 'Michael Crichton',
        },
      ]
    },
  },
};

const server = new ApolloServer({ 
  typeDefs, 
  resolvers
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
