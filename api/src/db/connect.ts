import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
let isConnected = false;

/**
 * Handles MongoDB connection using the URI from environment variables.
 * Uses a simple scoped variable for connection state.
 */
export async function connectDB(test:boolean=false): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }
  const uri = test ? process.env.MONGO_TEST_URI : process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  await mongoose.connect(uri);
  isConnected = true;
  return mongoose;
}

export async function disconnectDB(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
