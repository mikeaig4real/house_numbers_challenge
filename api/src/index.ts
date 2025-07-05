import dotenv from 'dotenv';
dotenv.config();
import { config } from '../config';
import { connectDB } from './db/connect';

import server, { initSocket } from './server';

const startApp = async () => {
  try {
    await connectDB();
    initSocket();
    console.log('Connected to MongoDB');
    server.listen(+config.port, '0.0.0.0', () => {
      console.log(`Snipify API running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  console.log('Starting Snipify API...');
  startApp();
}

export default startApp;
