const fetch = require('node-fetch');

/* 
  https://developers.google.com/places/web-service/search
*/
let key = 'AIzaSyBd0gI0OszcB1VkKFSD0jLbqKleC98N5tY'

let nearbySearchApi = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=36.057726,-115.237187&keyword=bar,bars&type=bar&radius=80000&maxprice=2&key='+key

let photoApi = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key='+key+'&photoreference='

let placeDetail = 'https://maps.googleapis.com/maps/api/place/details/json?key='+key+'&placeid='

let api = {
  get: async (v) => {
    const res = await fetch(v)
    const json = await res.json()
    if (json.status != 'OK') return false
    
    if (json.results) return json.results
    if (json.result) return json.result
  }
}

const resolvers = {
  Place: {
    id: (place) => place.place_id,
    title: (place) => place.name,
    images: async (place) => {
      let v = []
      
      let b = await api.get(placeDetail + place.place_id + '&fields=photos')
      
      console.log(b)

      for (let i = 0; i < b.photos.length; i++) {
        let bv = await fetch(photoApi + place.photos[i].photo_reference)
        v.push(bv.url)
      }
      return v
    },
    price: (place) => place.price_level,
    rating: (place) => place.rating,
    open_now: (place) => place.opening_hours.open_now,
    open_hours: (place) => {
      // include open now and hours
      // need to analyze data response to match schema
    },
    category: (place) => place.types,
    description: (place) => {
      // desc or reviews
      // need to rethink about this
    },
    location: (place) => {
      // need to analyze data and match
    },
    map_url: async (place) => {
      let b = await api.get(placeDetail + place.place_id + '&fields=url')
      return b.url
    },
    website: async (place) => {
      let b = await api.get(placeDetail + place.place_id + '&fields=website')
      return b.website
    },
    phone: async (place) => {
      let b = await api.get(placeDetail + place.place_id + '&fields=formatted_phone_number')
      return b.formatted_phone_number
    }
  },

  Query: {
    places: async () => await api.get(nearbySearchApi)
  },
}

/*
  - implement Mutation to display other types/categories
  - implment next page token, previous token, lazy loading
*/

module.exports.resolvers = resolvers;