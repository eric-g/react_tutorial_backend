import express, { Router } from "express";
import serverless from "serverless-http";
import Note from "../../models/note.js";
import cors from "cors";

const api = express()
const app = Router();

api.use(express.json()); // for parsing application/json
api.use(cors()); // for enabling CORS
api.use(express.static('dist'))

app.get('/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.post('/notes', (request, response) => {
  const body = JSON.parse(request.apiGateway.event.body);

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(result => {
    console.log('note saved!')
  })

  response.json(note)
})

app.get('/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    if (!note) {
      return response.status(404).send({ error: 'Note not found' })
    }
    response.json(note)
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

api.use("/api/", app);
export const handler = serverless(api);
