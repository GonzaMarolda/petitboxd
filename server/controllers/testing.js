const testingRouter = require('express').Router()
const Movie = require('../models/movie')

testingRouter.post('/reset', async (request, response) => {
  await Movie.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter