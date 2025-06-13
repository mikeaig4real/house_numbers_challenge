import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
let isConnected = false;

/**
 * Handles MongoDB connection using the URI from environment variables.
 * Uses a simple scoped variable for connection state.
 */
export async function connectDB(test:boolean=false): Promise<typeof mongoose> {
  
}

export async function disconnectDB(): Promise<void> {
  
}
