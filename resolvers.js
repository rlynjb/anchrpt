/* 
  https://developers.google.com/places/web-service/search
*/
let nearbySearchApi = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=36.057726,-115.237187&keyword=bar,bars&type=bar&radius=80000&maxprice=2&key=AIzaSyBd0gI0OszcB1VkKFSD0jLbqKleC98N5tY'

let photoApi = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=AIzaSyBd0gI0OszcB1VkKFSD0jLbqKleC98N5tY'

const resolvers = {
  Query: {
    places: async () => {
      const res = await fetch(nearbySearchApi)
      const json = await res.json()
      if (json.status != 'OK') return false
      let finalData = []

      json.results.forEach( i => {
        finalData.push({
          title: i.name,
          price: i.price,
          category: i.types,
          location: i.vicinity
        })
      })
      
      return finalData
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
    }
  },
};

module.exports.resolvers = resolvers;