const Genre = require("../models/genre")
const Country = require("../models/country")
const Petit = require("../models/petit")
const Movie = require("../models/movie")

const genres = require("./data/genres")
const countries = require("./data/countries")
const petits = require("./data/petits")
const movies = require("./data/movies")

const mongoose = require('mongoose')
const logger = require('../utils/logger')
const config = require('../utils/config')

const seedDatabase = async () => {
  try {
    const genresDic = await simpleAttributeLoader(Genre, genres)
    const petitsDic = await simpleAttributeLoader(Petit, petits)
    const countriesDic = await simpleAttributeLoader(Country, countries)

    const moviesWithIds = movies.map(movie => ({
        ...movie,
        genres: movie.genres.map(g => genresDic[g]),
        seenBy: movie.seenBy.map(p => petitsDic[p]),
        country: countriesDic[movie.country]
    }))
    
    await Movie.deleteMany() 
    await Movie.insertMany(moviesWithIds)
    logger.info("Movies loaded: ", movies.length)
    process.exit(0)
  } catch (error) {
    logger.error("Error in seed: ", error)
    process.exit(1)
  }
}

// Loads models with just a "name" attribute and returns a (name => id) dictionary 
const simpleAttributeLoader = async (Model, data) => {
    await Model.deleteMany() 
    const createdData = await Model.insertMany(data)
    logger.info(Model.modelName + " data loaded: ", createdData.length)

    const dictionary = createdData.reduce((acc, item) => {
        acc[item.name] = item.id
        return acc
    }, {})
    return dictionary
}

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB")
    } else console.log("Connected to MongoDB (Test)")
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message)
  })
seedDatabase()