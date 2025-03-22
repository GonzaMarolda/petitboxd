const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Petit = require('../models/petit')

loginRouter.post('/', async (request, response) => {
    const key  = request.body.key
  
    const petit = await Petit.findOne({ key: key })
  
    if (!petit) {
      return response.status(401).json({
        error: 'invalid petit key'
      })
    }
  
    const userForToken = {
      username: petit.name,
      id: petit.id,
    }
  
    const token = jwt.sign(userForToken, process.env.SECRET)
  
    response
      .status(200)
      .send({ token, user: petit.name, id: petit.id })
})
  
module.exports = loginRouter