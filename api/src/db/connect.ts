import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { config } from '../../config';
let isConnected = false;

/**
 * Handles MongoDB connection using the URI from environment variables.
 * Uses a simple scoped variable for connection state.
 */
export async function connectDB(test: boolean = false): Promise<typeof mongoose> {
  try {
    if (isConnected) {
      return mongoose;
    }
    const uri = test ? config.mongoTestUri : config.mongoUri;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(uri);
    isConnected = true;
    return mongoose;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    if ( isConnected )
    {
      await mongoose.disconnect();
      isConnected = false;
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}
