import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connect';
import snippetsRouter from './routes/snippets';
import authRouter from './routes/auth';
import sseRouter from './routes/sse';
import { jwtAuth } from './middleware/jwtAuth';
import { jwtAuthSocket } from './middleware/jwtAuthSocket';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { handleSocket } from "./socket";
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cookieParser from 'cookie-parser';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
};

declare module 'socket.io' {
  interface Socket {
    user?: any;
  }
}

const FE_URL = process.env.FE_URL || 'http://localhost:3030';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: FE_URL,
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: FE_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use('/api/snippets', jwtAuth);
app.use('/api/snippets', snippetsRouter);
app.use('/api/auth', authRouter);
app.use('/api/sse', jwtAuth);
app.use('/api/sse', sseRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Snipify API!');
} );

app.use(notFound);
app.use(errorHandler);
io.use(jwtAuthSocket);

const startApp = async () => {
  try {
    await connectDB();
    console.log( 'Connected to MongoDB' );
    io.on('connection', (socket) => {
      console.log( "A user connected" );
      const user = socket?.user
      if ( user )
      {
        console.log(`User ${user.id} connected`)
        socket.join( user.id );
        handleSocket(app, io, socket);
      };
    });
    const PORT = process.env.BE_PORT ? +process.env.BE_PORT : 3000;
    httpServer.listen(PORT, '0.0.0.0', () => {
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
export { app, io };
