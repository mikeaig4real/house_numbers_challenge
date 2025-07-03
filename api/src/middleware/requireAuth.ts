import { Response, NextFunction } from 'express';
import { AuthRequest, User } from '../../types';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[config.jwt.cookieName] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as Partial<User>;
    req.user = decoded;
  } catch (error) {
    console.error('JWT verification failed:', error); // possible issues from verifying the token (expired, invalid, etc.)
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }

  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: Invalid user data' });
    return;
  }

  next();
}
