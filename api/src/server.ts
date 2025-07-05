import { createServer, Server as HttpServer } from 'http';
import { Express } from 'express';
import dotenv from 'dotenv';
import initSocket from "./socket.app";
dotenv.config();


const initServer = (app: Express) => {
  const httpServer = createServer(app);
  const io = initSocket(httpServer, app);
  return { httpServer, io };
};

export default initServer;
