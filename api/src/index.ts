import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connect';
import snippetsRouter from './routes/snippets';
import authRouter from './routes/auth';
import sseRouter from './routes/sse';
import { jwtAuthSocket } from './middleware/jwtAuthSocket';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { handleSocket } from "./socket";
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { config } from "../config";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.frontendUrl,
    credentials: true,
  },
});

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
    httpServer.listen(+config.port, '0.0.0.0', () => {
      console.log(`Snipify API running on port ${config.port}`);
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
