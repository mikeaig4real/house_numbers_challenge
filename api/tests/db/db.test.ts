import { expect, test, afterAll } from 'vitest';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../../src/db/connect';

dotenv.config();

test('MongoDB connection works', async () => {
  const conn = await connectDB(true);
  expect(conn.connection.readyState).toBe(1);
  await disconnectDB();
});

afterAll(async () => {
  await disconnectDB();
});
