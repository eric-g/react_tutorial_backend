import app from './app.mjs' // the actual Express application
import { connectToDatabase } from './utils/db.js';
import logger from './utils/logger.js'
import dotenv from 'dotenv'
dotenv.config()

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`)
})