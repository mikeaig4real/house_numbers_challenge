import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connect';
import snippetsRouter from './routes/snippets';
import authRouter from './routes/auth';
import sseRouter from './routes/sse';
import { jwtAuth } from './middleware/jwtAuth';
import cookieParser from 'cookie-parser';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
app.use(express.json());
app.use(cookieParser());


const FE_URL = process.env.FE_URL || 'http://localhost:3030';
app.use(
  cors({
    origin: FE_URL,
    credentials: true,
  }),
);


app.use('/api/snippets', jwtAuth);
app.use('/api/snippets', snippetsRouter);
app.use('/api/auth', authRouter);
app.use('/api/sse', sseRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Snipify API!');
});

const startApp = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    const PORT = process.env.BE_PORT ? +process.env.BE_PORT : 3000;
    app.listen(PORT, () => {
      console.log(`Snipify API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startApp();
}

export default app;
export { app };
