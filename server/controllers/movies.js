 const moviesRouter = require('express').Router()
const Movie = require('../models/movie')
const upload = require('../utils/storage')

moviesRouter.get('/', async (request, response) => {
  const movies = await Movie.find({}).populate(["genres", "seenBy", "country"])
  response.json(movies)
})

moviesRouter.post('/', upload.single("poster"), async (request, response) => {
  const movie = new Movie({
    ...request.body,
    poster: request.file ? request.file.filename : null
  })

  console.log("Request file: " + request.file)

  const savedMovie = await movie.save()
  const populatedMovie = await Movie.findById(savedMovie.id).populate(["genres", "seenBy", "country"])

  return response.status(201).json(populatedMovie)
})

module.exports = moviesRouter