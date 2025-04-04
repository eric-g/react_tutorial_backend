// const express = require('express')
// const cors = require('cors')

import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
const bodyParser = require('body-parser');

const api = express()
const app = Router();

api.use(express.json()); // for parsing application/json
api.use(cors()); // for enabling CORS
api.use(express.static('dist'))
// api.use((request, response, next) => {
//   response.header('Access-Control-Allow-Origin', '*');
//   next();
// });

let notes = [
  {
    id: "1",
    content: "HTML is easy!",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


app.get('/notes', (request, response) => {
  response.json(notes)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/notes', (request, response) => {
  const body = JSON.parse(request.apiGateway.event.body);

  console.log(body)

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (!note) {
    response.status(404).send({ error: 'Note not found' })
  } 
  response.json(note)
})

app.delete('/notes/:id', (request, response) => {
  const id = request.params.id
  len = notes.length
  console.log("Notes length: " ,len)
  notes = notes.filter(note => note.id !== id)
  if (len === notes.length) {
    return response.status(404).send({ error: 'Note not found' })
  }

  response.status(204).end()
})

app.put('/notes/:id', (request, response) => {
  const id = request.params.id
  const itemIndex = notes.findIndex((item) => item.id === id);
  notes[itemIndex] = JSON.parse(request.apiGateway.event.body);

  response.json(notes[itemIndex]);
})

// const PORT = 3002
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
api.use("/api/", app);
export const handler = serverless(api);
