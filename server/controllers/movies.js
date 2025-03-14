const moviesRouter = require('express').Router()
const Movie = require('../models/movie')

moviesRouter.get('/', async (request, response) => {
  const movies = await Movie.find({}).populate(["genres", "seenBy", "country"])
  response.json(movies)
})

module.exports = moviesRouter