const fetch = require('node-fetch')
const moment = require('moment')

// https://developers.google.com/places/web-service/search
let key = 'AIzaSyBd0gI0OszcB1VkKFSD0jLbqKleC98N5tY'

let nearbySearchApi = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=36.057726,-115.237187&radius=80000&maxprice=2&key='+key+'&keyword='

let photoApi = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key='+key+'&photoreference='

let placeDetail = 'https://maps.googleapis.com/maps/api/place/details/json?key='+key+'&placeid='

let api = {
  nextPageToken: null,
  get: async (v) => {
    const res = await fetch(v)
    const json = await res.json()
    if (json.status != 'OK') return false

    this.nextPageToken = json.next_page_token ? json.next_page_token : null
    if (json.results) return json.results
    if (json.result) return json.result
  }
}

let helper = {
  mapLocationFields: (arrItems, arrFields) => {
    let cleanAddress = []

    arrItems.map((i,v,k) => {
      i.types.filter(iv => {
        arrFields.forEach(fv => {
          if (iv.includes(fv)) cleanAddress.push(i.short_name)
        })
      })
    })
    
    return cleanAddress.join(" ")
  }
}

const resolvers = {
  Place: {
    id: (place) => place.place_id,
    title: (place) => place.name,
    images: async (place) => {
      let v = []
      //let moreImgs = await api.get(placeDetail + place.place_id + '&fields=photos')

      for (let i = 0; i < place.photos.length; i++) {
        let b = await fetch(photoApi + place.photos[i].photo_reference)
        v.push(b.url)
      }
      return v
    },
    price: (place) => place.price_level,
    rating: (place) => place.rating,
    open_now: (place) => place.opening_hours.open_now,
    open_hours: async (place) => {
      let b = await api.get(placeDetail + place.place_id + '&fields=opening_hours')
      return b.opening_hours.periods
    },
    category: (place) => place.types,
    description: (place) => {
      // desc or reviews, need to rethink about this
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

  OpenHours: {
    date: (date) => moment(date.open.day, 'd').format('ddd'),
    time: (date) => {
      let v = []
      let td = { start: '', end: '' }
      
      for (let i=0; i<=6; i++) {
        if (date.open.day === i && date.close) {
          td.start = moment(date.open.time, 'HH').format('h:mma')
          td.end = moment(date.close.time, 'HH').format('h:mma')
          v.push(td)
        }
      }

      return v
    }
  },

  Time: {
    start: (time) => time.start,
    end: (time) => time.end
  },

  Location: {
    address: (location) => helper.mapLocationFields(location, ["street_number", "route", "locality"]),
    zipcode: (location) => helper.mapLocationFields(location, ["postal_code"]),
    city: (location) => helper.mapLocationFields(location, ["administrative_area_level_2"]),
    state: (location) => helper.mapLocationFields(location, ["administrative_area_level_1"]),
    country: (location) => helper.mapLocationFields(location, ["country"])
  },

  Query: {
    places: async (root, { type, nextPage }, context) => {
      let nToken = nextPage ? '&next_page_token=' + api.nextPageToken : ''
      let v = await api.get(nearbySearchApi + type + nToken)
      return v
    },
    places_next_page: () => {
      console.log('kirby', api)
      return api.nextPageToken ? api.nextPageToken : false
    }
  },
}

/*
  - implement next page token, previous token, lazy loading
*/

module.exports.resolvers = resolvers