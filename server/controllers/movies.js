const moviesRouter = require('express').Router()
const Movie = require('../models/movie')
const Rating = require('../models/rating')
const upload = require('../utils/storage')

moviesRouter.get('/', async (request, response) => {
  const movies = await Movie.find({}).populate(["genres", "seenBy", "country"])
  response.json(movies)
})

moviesRouter.post('/', upload.single("poster"), async (request, response) => {
  if (process.env.NODE_ENV !== "test" && !request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  } 

  const movie = new Movie({
    ...request.body,
    poster: request.file ? request.file.filename : null
  })

  console.log("Request file: " + request.file)

  const savedMovie = await movie.save()
  const rating = new Rating({
    movie: savedMovie.id,
    reviews: []
  })
  await rating.save()

  const populatedMovie = await Movie.findById(savedMovie.id).populate(["genres", "seenBy", "country"])
  return response.status(201).json(populatedMovie)
})

moviesRouter.put('/:id', upload.single("poster"), async (request, response) => {
  if (!request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const movie = {
    ...request.body,
    poster: request.file ? request.file.filename : request.body.poster
  }

  console.log("Request file: " + request.file)

  const updatedMovie = await Movie.findByIdAndUpdate(request.params.id, movie, { new: true, runValidators: true, context: 'query' }).populate(["genres", "seenBy", "country"])
  response.json(updatedMovie)
})

module.exports = moviesRouter