//const app = require('./app') // the actual Express application
//const config = require('./utils/config')
//const logger = require('./utils/logger')

import app from './app.mjs' // the actual Express application
import logger from './utils/logger.js'
import dotenv from 'dotenv'
dotenv.config()

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`)
})