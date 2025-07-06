import { Request } from 'express';
import { Socket } from 'socket.io';

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface AuthRequest<Params = {}, ResBody = {}, ReqBody = {}> extends Request<Params, ResBody, ReqBody> {
  user?: Partial<User>;
}

export interface AuthSocket extends Socket {
  user?: Partial<User>;
}
