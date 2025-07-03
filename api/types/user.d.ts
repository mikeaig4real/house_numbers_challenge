import { Request } from 'express';
import { Socket } from 'socket.io';

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: Partial<User>;
}

export interface AuthSocket extends Socket {
  user?: Partial<User>;
}
