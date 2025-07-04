//const express = require('express')
//const mongoose = require('mongoose')
//const config = require('./utils/config')
//const dotenv = require('dotenv')
//const logger = require('./utils/logger')
//const notesRouter = require('./controllers/notes')
//const middleware = require('./utils/middleware')

import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import logger from './utils/logger.js'
import notesRouter from './controllers/notes.js'
import usersRouter from './controllers/users.js'
import middleware from './utils/middleware.js'

const app = express()
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
logger.info('connecting to MongoDB ...')
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB!')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
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