const mongoose = require('mongoose')

const suggestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    }
})

suggestionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('Suggestion', suggestionSchema)