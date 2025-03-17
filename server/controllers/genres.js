const genresRouter = require('express').Router()
const Genre = require('../models/genre')

genresRouter.get('/', async (request, response) => {
  const genres = await Genre.find({})
  response.json(genres)
})

module.exports = genresRouter