const testingRouter = require('express').Router()
const Movie = require('../models/movie')
const Rating = require('../models/rating')
const Review = require('../models/review')

testingRouter.post('/reset', async (request, response) => {
  await Movie.deleteMany({})
  await Rating.deleteMany({})
  await Review.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter