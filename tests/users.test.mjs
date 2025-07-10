import bcrypt from 'bcrypt'
import User from '../models/user.js'
import supertest from 'supertest'
import { test, after, beforeEach, describe } from 'node:test'
import app from '../app.mjs'
import helper from './test_helper.js'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    const usersAtStart = await helper.usersInDb()
    console.log(usersAtStart)
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const name = "Superuser"
    const user = new User({ username: 'root', passwordHash, name })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400, {
        error: 'expected `username` to be unique',
      })  

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})

after(async () => {
  await mongoose.connection.close()
})