const mongoose = require('mongoose')
const Genre = require("./genre")
const Movie = require("./movie")
const Petit = require("./petit")
const Country = require("./country")

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: false
    },
    year: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    length: {
        type: Number,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Petit',
        required: false
    }]
})

movieSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
module.exports = mongoose.model('Movie', movieSchema)