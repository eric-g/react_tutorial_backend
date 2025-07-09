import mongoose from "mongoose";
import logger from "./logger.js";

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) {
        logger.info("MongoDB connection already established.");
        return;
    }
    mongoose.set('strictQuery', false)
    logger.info('connecting to MongoDB ...')
    try {
        await mongoose.connect(MONGODB_URI)
        isConnected = true;
        logger.info('Connected to MongoDB on Netlify!')
    } catch(error) {
        logger.error('Error connection to MongoDB:', error.message)
        throw error;
    }
}
