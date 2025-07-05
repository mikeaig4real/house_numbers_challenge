import dotenv from 'dotenv';
dotenv.config();
import { config } from '../config';
import { connectDB } from './db/connect';
import initApp from "./app";
import initServer from "./server";

const startApp = async () => {
  try {
    await connectDB();
    const app = initApp();
    const { httpServer, io } = initServer(app);
    console.log('Connected to MongoDB');
    httpServer.listen(+config.port, '0.0.0.0', () => {
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
