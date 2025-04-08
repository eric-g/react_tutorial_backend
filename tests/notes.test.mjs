import { test, after } from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import assert from 'node:assert/strict'
import app from '../app.mjs'

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there is at least one note', async () => {
    const response = await api.get('/api/notes')
    assert(response.body.length > 0, 'No notes found')
  })

test('there is one note at /id', async () => {
  let response = await api.get('/api/notes')
  const id = response.body[0].id
  const isImportant = response.body[0].important
  response = await api.get(`/api/notes/${id}`)

  assert(response.body.id === id, 'ID mismatch found')
  assert(response.body.important === isImportant, 'Important mismatch found')

})

test('a note is about CSS difficulty', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('CSS is hard'), 'Expected content not found')
})

after(async () => {
  await mongoose.connection.close()
})