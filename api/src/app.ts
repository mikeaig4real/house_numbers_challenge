import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import snippetsRouter from './routes/snippets';
import authRouter from './routes/auth';
import sseRouter from './routes/sse';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
import { config } from '../config';

const app = express();

const initApp = () => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: config.frontendUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    }),
  );
  app.use('/api/snippets', snippetsRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/sse', sseRouter);

  app.get('/', (req, res) => {
    res.send('Welcome to Snipify API!');
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default initApp;
