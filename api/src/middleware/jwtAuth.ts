import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, User } from '../../types';
import { config } from "../../config";


export function jwtAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[config.jwt.cookieName] || req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as Partial<User>;
    req.user = decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  next();
}
