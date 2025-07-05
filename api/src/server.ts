import { createServer } from 'http';
import dotenv from 'dotenv';
dotenv.config();
import { jwtAuthSocket } from './middleware/jwtAuthSocket';
import { handleSocket } from './socket';
import { Server } from 'socket.io';
import { config } from '../config';
import { AuthSocket } from '../types';
import app from './app';

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.frontendUrl,
    credentials: true,
  },
});

io.use(jwtAuthSocket);

const initSocket = () => {
  io.on('connection', (socket: AuthSocket) => {
    console.log('A user connected');
    const user = socket?.user;
    if (user) {
      console.log(`User ${user.id} connected`);
      socket.join(user.id!);
      handleSocket(app, io, socket);
    }
  });
};

export default httpServer;
export { initSocket, io };
