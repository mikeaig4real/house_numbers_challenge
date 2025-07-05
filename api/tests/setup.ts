import dotenv from 'dotenv';
dotenv.config();
import { connectDB, disconnectDB } from '../src/db/connect';
import { beforeAll, afterAll } from "vitest";

beforeAll( async () =>
{
  await connectDB(true);
});

afterAll(async () => {
  await disconnectDB();
});
