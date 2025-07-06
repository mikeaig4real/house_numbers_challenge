import { expect, test } from 'vitest';
import { connectDB } from '../../src/db/connect';

test('MongoDB connection works', async () => {
  const conn = await connectDB(true);
  expect(conn.connection.readyState).toBe(1);
});
