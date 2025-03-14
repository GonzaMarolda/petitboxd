const mongoose = require('mongoose')

const petitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

petitSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
module.exports = mongoose.model('Petit', petitSchema)