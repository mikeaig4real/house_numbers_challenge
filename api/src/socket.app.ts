import { Server as HttpServer } from 'http';
import { Express } from 'express';
import { jwtAuthSocket } from './middleware/jwtAuthSocket';
import { handleSocket } from './socket';
import { Server as SocketServer } from 'socket.io';
import { config } from '../config';
import { AuthSocket } from '../types';

const initSocket = (server: HttpServer, app: Express) => {
  const io = new SocketServer(server, {
    cors: {
      origin: config.frontendUrl,
      credentials: true,
    },
  });

  io.use(jwtAuthSocket);

  io.on('connection', (socket: AuthSocket) => {
    console.log('A user connected');
    const user = socket?.user;
    if (user) {
      console.log(`User ${user.id} connected`);
      socket.join(user.id!);
      handleSocket(app, io, socket);
    }
  });

  return io;
};

export default initSocket;
