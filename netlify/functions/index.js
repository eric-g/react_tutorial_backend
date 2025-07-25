import express, { Router } from "express";
import serverless from "serverless-http";
import Note from "../../models/note.js";
import mongoose from "mongoose";
import logger from "../../utils/logger.js";
import {errorHandler, unknownEndpoint} from '../../utils/middleware_netlify.js'

const api = express()
const app = Router();
const MONGODB_URI = process.env.MONGODB_URI
api.use(express.json()); // for parsing application/json
api.use(express.static('dist'))

mongoose.set('strictQuery', false)

if (mongoose.connection.readyState === 0) {
  logger.info('connecting to MongoDB ...')
  mongoose.connect(MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB on Netlify!')
    })
    .catch((error) => {
      logger.error('error connection to MongoDB:', error.message)
    })
} else {
    logger.info('MongoDB connection already established.')
  }

app.get('/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

app.post('/notes', (request, response, next) => {
  const body = JSON.parse(request.apiGateway.event.body);

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    console.log('note saved!')
    response.status(201).json(savedNote)
  })
  .catch(error => next(error))

})

app.get('/notes/:id', (request, response) => {
  Note.findById(request.params.id)
  .then(note => {
    if (!note) {
      return response.status(404).send({ error: 'Note not found' })
    }
    response.json(note)
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'invalid id' })
  })
})

app.delete('/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
  .then((result) => {
    response.status(204).end()
  })
  .catch((error) => next(error))
})

app.put('/notes/:id', (request, response, next) => {
  const { content, important } = JSON.parse(request.apiGateway.event.body);

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

api.use("/api/", app);
export const handler = serverless(api);
