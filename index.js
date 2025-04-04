const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json()); // for parsing application/json
app.use(cors()); // for enabling CORS
app.use(express.static('dist'))
// app.use((request, response, next) => {
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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

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

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (!note) {
    response.status(404).send({ error: 'Note not found' })
  } 
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const len = notes.length
  console.log("Notes length: " ,len)
  notes = notes.filter(note => note.id !== id)
  if (len === notes.length) {
    return response.status(400).send({ error: 'Note not found' })
  }

  response.status(204).end()
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
