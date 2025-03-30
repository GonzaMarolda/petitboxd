const ratingsRouter = require('express').Router()
const Rating = require('../models/rating')
const Review = require('../models/review')

ratingsRouter.get('/:id', async (request, response) => {
  const ratings = await Rating.findOne({movie: request.params.id})
    .populate({path: "reviews", populate: { path: "petit" }})

  
  response.json(ratings)
})

ratingsRouter.put('/:id', async (request, response) => {
    if (process.env.NODE_ENV !== "test" && !request.user?.id) {
      return response.status(401).json({ error: 'invalid token' })
    } 

    const review = new Review({
        ...request.body
    })
    const savedReview = await review.save()

    const rating = await Rating.findOne({movie: request.params.id})
    const newRating = {
      movie: rating.movie, 
      reviews: rating.reviews.concat(savedReview.id)
    }

    const updatedRating = await Rating.findOneAndUpdate({movie: request.params.id}, newRating, { new: true, runValidators: true, context: 'query' }).populate(["reviews"])

    response.json(updatedRating)
})

module.exports = ratingsRouter