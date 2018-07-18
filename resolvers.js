const fetch = require('node-fetch');

/* 
  https://developers.google.com/places/web-service/search
*/
let nearbySearchApi = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=36.057726,-115.237187&keyword=bar,bars&type=bar&radius=80000&maxprice=2&key=AIzaSyBd0gI0OszcB1VkKFSD0jLbqKleC98N5tY'

let photoApi = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=AIzaSyBd0gI0OszcB1VkKFSD0jLbqKleC98N5tY&photoreference='

let api = {
  get: async (v) => {
    const res = await fetch(v)
    const json = await res.json()
    if (json.status != 'OK') return false
    
    return json.results
  }
}

const resolvers = {
  Place: {
    id: (place) => place.place_id,
    title: (place) => place.name,
    price: (place) => place.price_level,
    category: (place) => place.types,
    images: async (place) => {
      let v =[]
      for (let i = 0; i < place.photos.length; i++) {
        const b = await fetch(photoApi + place.photos[i].photo_reference)
        const vc = await b.blob()
        console.log(vc)
        v.push(vc)
      }
      return v
    }
  },

  Query: {
    places: async () => await api.get(nearbySearchApi)
  },
}

module.exports.resolvers = resolvers;