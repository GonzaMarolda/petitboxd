require("express-async-errors") 
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const config = require("./utils/config")

const moviesRouter = require("./controllers/movies")
const genresRouter = require("./controllers/genres")
const countriesRouter = require("./controllers/countries")
const petitsRouter = require("./controllers/petits")

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/uploads', express.static('uploads'))

app.use("/api/movies", moviesRouter)
app.use("/api/genres", genresRouter)
app.use("/api/countries", countriesRouter)
app.use("/api/petits", petitsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app