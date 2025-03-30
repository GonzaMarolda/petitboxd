const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    petit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Petit',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0.5,
        max: 5
    },
    comment: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

reviewSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('Review', reviewSchema)