const suggestionsRouter = require('express').Router()
const Suggestion = require('../models/suggestion')

suggestionsRouter.get('/', async (request, response) => {
  const suggestions = await Suggestion.find({})
  response.json(suggestions)
})

suggestionsRouter.post('/', async (request, response) => {
  if (process.env.NODE_ENV !== "test" && !request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  } 

  const suggestion = new Suggestion({...request.body})
  const savedSuggestion = await suggestion.save()

  return response.status(201).json(savedSuggestion)
})

suggestionsRouter.delete('/:id', async (request, response) => {
  if (process.env.NODE_ENV !== "test" && !request.user?.id) {
    return response.status(401).json({ error: 'invalid token' })
  } 

  const suggestionToDelete = await Suggestion.findById(request.params.id)
  if (!suggestionToDelete) {
    return response.status(404).json({ error: 'suggestion not found' })
  }
  await Suggestion.deleteOne({ _id: suggestionToDelete.id })
  return response.sendStatus(204);
})

module.exports = suggestionsRouter