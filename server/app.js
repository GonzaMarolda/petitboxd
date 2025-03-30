require("express-async-errors") 
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const middleware = require("./utils/middleware")
const config = require("./utils/config")

const moviesRouter = require("./controllers/movies")
const genresRouter = require("./controllers/genres")
const countriesRouter = require("./controllers/countries")
const petitsRouter = require("./controllers/petits")
const loginRouter = require("./controllers/login")
const ratingsRouter = require("./controllers/ratings")

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB")
    } else console.log("Connected to MongoDB (Test)")
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/uploads', express.static('uploads'))
app.use(express.static('dist'))

app.use("/api/movies", middleware.userExtractor, moviesRouter)
app.use("/api/genres", genresRouter)
app.use("/api/countries", countriesRouter)
app.use("/api/petits", petitsRouter)
app.use("/api/ratings", middleware.userExtractor, ratingsRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app