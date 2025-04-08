import express from 'express'
import Note from './models/note_node.js'
const app = express()

app.use(express.json()); // for parsing application/json
app.use(express.static('dist'))

app.get('/api/notes', (request, response) => {
  console.log('Fetching notes from MongoDB...')
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({ 
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    console.log('note saved!')
    response.json(savedNote)
  })
  .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (!note) {
    response.status(404).send({ error: 'Note not found' })
  } 
  response.json(note)
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
  .then((result) => {
    response.status(204).end()
  })
  .catch((error) => next(error))
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const itemIndex = notes.findIndex((item) => item.id === id);
  notes[itemIndex] = request.body;

  response.json(notes[itemIndex]);
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
