import { createServer, Server as HttpServer } from 'http';
import { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const initServer = (app: Express) => {
  const httpServer = createServer(app);
  return { httpServer };
};

export default initServer;
