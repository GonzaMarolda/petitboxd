const mongoose = require('mongoose')

const petitSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true   
    }
})

petitSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.key
    }
  })
  
module.exports = mongoose.model('Petit', petitSchema)