import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS setup for credentials and FE_URL
const FE_URL = process.env.FE_URL || 'http://localhost:3030';
app.use(
  cors({
    origin: FE_URL,
    credentials: true,
  }),
);

// routes

app.get('/', (req, res) => {
  res.send('Welcome to Snipify API!');
});

const startApp = async () => {
  try {
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
  const PORT = process.env.PORT || 3000;
  startApp();
}

export default app;
export { app };
