const moviesRouter = require('express').Router()
const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie')
const Rating = require('../models/rating')
const upload = require('../utils/storage')
const { v2: cloudinary } = require('cloudinary');

moviesRouter.get('/', async (request, response) => {
  const movies = await Movie.find({}).populate(["genres", "seenBy", "country"])
  response.json(movies)
})

moviesRouter.post('/', upload.single("poster"), async (request, response) => {
  if (process.env.NODE_ENV !== "test" && !request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  } 

  const movie = new Movie({
    ...request.body,
    poster: request.file ? request.file.path : null,
    poster_id: request.file ? request.file.filename : null
  })

  console.log("Request file: " + request.file)

  const savedMovie = await movie.save()
  const rating = new Rating({
    movie: savedMovie.id,
    reviews: []
  })
  await rating.save()

  const populatedMovie = await Movie.findById(savedMovie.id).populate(["genres", "seenBy", "country"])
  return response.status(201).json(populatedMovie)
})

moviesRouter.put('/:id', upload.single("poster"), async (request, response) => {
  if (!request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  try {
    const movieToUpdate = { ...request.body }

    const existingMovie = await Movie.findById(request.params.id);
    if (existingMovie.poster_id) {
      await cloudinary.uploader.destroy(existingMovie.poster_id);
    }
    if (request.file) {  
      movieToUpdate.poster = request.file.path;
      movieToUpdate.poster_id = request.file.filename;
    }
  
    console.log("Request file: " + request.file)
  
    const updatedMovie = await Movie.findByIdAndUpdate(request.params.id, movieToUpdate, { new: true, runValidators: true, context: 'query' }).populate(["genres", "seenBy", "country"])
    response.json(updatedMovie)
  } catch (error) {
    if (request.file?.filename) {
      await cloudinary.uploader.destroy(request.file.filename);
    }
    
    response.status(500).json({ error: error.message });
  }
})

moviesRouter.patch('/priority/:id', async (request, response) => {
  if (!request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  await Movie.updateOne(
    { _id: request.params.id},
    { $set: { hasPriority: request.body.priority } }, 
    { new: true, runValidators: true }
  )
  response.sendStatus(204)
})

moviesRouter.delete('/:id', async (request, response) => {
  if (!request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const movieToDelete = await Movie.findById(request.params.id)
  if (!movieToDelete) {
    return response.status(404).json({ error: 'movie not found' })
  }
  const ratingToDelete = await Rating.findOne({movie: request.params.id})
  if (!ratingToDelete) {
    return response.status(404).json({ error: 'movie rating not found' })
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    await Movie.deleteOne({ _id: movieToDelete.id }).session(session);
    await Rating.deleteOne({ _id: ratingToDelete.id }).session(session);
    
    await session.commitTransaction();
    return response.sendStatus(204);
  } catch (transactionError) {
    await session.abortTransaction();
    throw transactionError;
  } finally {
    console.log("AAAAAA")
    session.endSession();
  }
})

module.exports = moviesRouter