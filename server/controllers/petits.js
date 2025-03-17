const petitsRouter = require('express').Router()
const Petit = require('../models/petit')

petitsRouter.get('/', async (request, response) => {
  const petits = await Petit.find({})
  response.json(petits)
})

module.exports = petitsRouter