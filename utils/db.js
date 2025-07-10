import mongoose from "mongoose";
import logger from "./logger.js";

let isConnected = false;

export const connectToDatabase = async () => {

    const MONGODB_URI = process.env.MONGODB_URI;
    
    logger.info('Connecting to MongoDB ...')
    if (isConnected) {
        logger.info("MongoDB connection already established.");
        return;
    }
    mongoose.set('strictQuery', false)
    try {
        await mongoose.connect(MONGODB_URI)
        isConnected = true;
        console.log('Initial connection to MongoDB established!')
    } catch(error) {
        logger.error('Error connection to MongoDB:', error.message)
        throw error;
    }
}
