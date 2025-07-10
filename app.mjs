import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import logger from './utils/logger.js'
import notesRouter from './controllers/notes.js'
import usersRouter from './controllers/users.js'
import middleware from './utils/middleware.js'
import { connectToDatabase } from './utils/db.js'

const app = express()
dotenv.config()

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB!')
    next();
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    res.status(500).send({ error: 'Database connection error' });
  }
})

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
//module.exports = app