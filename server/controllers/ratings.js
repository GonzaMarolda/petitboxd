const ratingsRouter = require('express').Router()
const Rating = require('../models/rating')
const Review = require('../models/review')
const { Types: { ObjectId } } = require('mongoose');

ratingsRouter.get('/:id', async (request, response) => {
  const ratings = await Rating.findOne({movie: request.params.id})
    .populate({path: "reviews", populate: { path: "petit" }})

  response.json(ratings)
})

ratingsRouter.put('/:id', async (request, response) => {
    if (process.env.NODE_ENV !== "test" && !request.user?.id) {
      return response.status(401).json({ error: 'invalid token' })
    } 

    const populatedRating = await Rating.findOne({movie: request.params.id}).populate("reviews")

    const existingReview = populatedRating.reviews?.find(r => r.petit.toString() === request.body.petit)

    let savedReview = null
    if (existingReview) {
      const review = {
        ...request.body,
        date: Date.now()
      }
      await Review.findOneAndUpdate({petit: existingReview.petit}, review)
    } else {
      const review = new Review({
        ...request.body
      })
      savedReview = await review.save()
    }

    const rating = await Rating.findOne({movie: request.params.id})

    const newRating = {
      movie: rating.movie, 
      reviews: existingReview ? 
        rating.reviews : 
        rating.reviews.concat(savedReview.id)
    }

    const updatedRating = await Rating.findOneAndUpdate({movie: request.params.id}, newRating, { new: true, runValidators: true, context: 'query' }).populate({path: "reviews", populate: { path: "petit" }})

    response.json(updatedRating)
})

ratingsRouter.delete('/:id', async (request, response) => {
  if (process.env.NODE_ENV !== "test" && !request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  } 

  const rating = await Rating.findOne({movie: request.params.id}, { new: true, runValidators: true, context: 'query' }).populate({path: "reviews", populate: { path: "petit" }})
  const petitReview = rating.reviews.find(r => r.petit.id === request.user.id)
  await Review.findByIdAndDelete(petitReview.id)
  const newRating = {
    movie: rating.movie, 
    reviews: rating.reviews.filter(r => r.petit !== request.user.id)
  }
  const updatedRating = await Rating.findOneAndUpdate({movie: request.params.id}, newRating, { new: true, runValidators: true, context: 'query' }).populate({path: "reviews", populate: { path: "petit" }})
  return response.json(updatedRating)
})

module.exports = ratingsRouter