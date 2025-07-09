import express, { Router } from "express";
import serverless from "serverless-http";
import User from "../../models/user.js";
import logger from "../../utils/logger.js";
import { connectToDatabase } from "../../utils/db.js";
import {errorHandler, unknownEndpoint} from '../../utils/middleware_netlify.js'

const api = express()
const app = Router();
api.use(express.json()); // for parsing application/json
api.use(express.static('dist'))

app.use(async (req, res, next) => {
  try {
    logger.info('connecting to MongoDB ...')
    await connectToDatabase();
    logger.info('connected to MongoDB via Netlify!')
    next();
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    res.status(500).send({ error: 'Database connection error' });
  }
})

app.get('/users', async (request, response) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error.message);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});

app.use(unknownEndpoint)
app.use(errorHandler)

api.use("/api/", app);
export const handler = serverless(api);