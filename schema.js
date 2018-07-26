const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    places(type: String): PlacesRoot
  }

  type PlacesRoot {
    result: [Place],
    places_next_page: Boolean
  }

  type Place {
    id: String,
    title: String
    # images: [String],
    # price: Int,
    # rating: Float,
    # open_now: Boolean,
    # open_hours: [OpenHours],
    # category: [String],
    # description: String,
    # location: Location,
    # map_url: String,
    # website: String,
    # phone: String
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
`;

module.exports.typeDefs = typeDefs;