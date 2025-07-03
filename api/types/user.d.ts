import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: Partial<User>;
}
