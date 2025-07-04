//const notesRouter = require('express').Router()
import { Router } from 'express'
import Note from '../models/note_node.js'
import User from '../models/user.js'

const notesRouter = Router()

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {

        const note = await Note.findById(request.params.id)

        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
})

notesRouter.post('/', async (request, response, next) => {
    const body = request.body
    console.log("Body:", body)
    const user = await User.findById(body.userId)
    console.log("User:", user)  

    const note = new Note({
        content: body.content,
        important: body.important || false,
        user: user.id,
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote)
    
})

notesRouter.delete('/:id', async (request, response, next) => {
    try {
        await Note.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

notesRouter.put('/:id', async (request, response, next) => {
    const { content, important } = request.body
    try {
            const note = await Note.findById(request.params.id)
            if (!note) {
                return response.status(404).end()
            }
            note.content = content
            note.important = important

            return note.save().then((updatedNote) => {
                response.json(updatedNote)
            })
        } catch (error) {
            next(error)
        }
})

export default notesRouter