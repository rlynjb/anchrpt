const { gql } = require('apollo-server');

const typeDefs = gql`
  type Place {
    id: String,
    title: String,
    images: [String],
    price: Int,
    rating: Float,
    open_now: Boolean,
    open_hours: [OpenHours],
    category: [String],
    description: String,
    location: Location,
    map_url: String,
    website: String,
    phone: String
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
    places: [Place]
  }
`;

module.exports.typeDefs = typeDefs;