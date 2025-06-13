import mongoose from 'mongoose';
import { expect, test, afterAll } from 'vitest';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../../src/db/connect';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/snipify';

test('MongoDB connection works', async () => {
  const conn = await connectDB();
  expect(conn.connection.readyState).toBe(1);
  await disconnectDB();
});

afterAll(async () => {
  await disconnectDB();
});
