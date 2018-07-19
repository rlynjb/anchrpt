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
      
      let moreImgs = await api.get(placeDetail + place.place_id + '&fields=photos')

      for (let i = 0; i < moreImgs.photos.length; i++) {
        let b = await fetch(photoApi + moreImgs.photos[i].photo_reference)
        v.push(b.url)
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
    location: async (place) => {
      let b = await api.get(placeDetail + place.place_id + '&fields=address_components')
      return b.address_components
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

  Location: {
    address: (location) => {
      let cleanAddress = []

      location.map((i,v,k) => {
        i.types.filter(iv => {
          if (iv.includes("street_number")) cleanAddress.push(i.short_name)
          if (iv.includes("route")) cleanAddress.push(i.short_name)
          if (iv.includes("locality")) cleanAddress.push(i.short_name)
        })
      })
      
      return cleanAddress.join(" ")
    },
    zipcode: (location) => {
      let cleanAddress = []

      location.map((i,v,k) => {
        i.types.filter(iv => {
          if (iv.includes("postal_code")) cleanAddress.push(i.short_name)
        })
      })
      
      return cleanAddress.join(" ")
    },
    city: (location) => {
      let cleanAddress = []

      location.map((i,v,k) => {
        i.types.filter(iv => {
          if (iv.includes("administrative_area_level_2")) cleanAddress.push(i.short_name)
        })
      })
      
      return cleanAddress.join(" ")
    },
    state: (location) => {
      let cleanAddress = []

      location.map((i,v,k) => {
        i.types.filter(iv => {
          if (iv.includes("administrative_area_level_1")) cleanAddress.push(i.short_name)
        })
      })
      
      return cleanAddress.join(" ")
    },
    country: (location) => {
      let cleanAddress = []

      location.map((i,v,k) => {
        i.types.filter(iv => {
          if (iv.includes("country")) cleanAddress.push(i.short_name)
        })
      })
      
      return cleanAddress.join(" ")
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