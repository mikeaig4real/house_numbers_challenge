import { Response, NextFunction } from 'express';
import { AuthRequest, User } from '../../types';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AuthError } from "../errors/authError";

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[config.jwt.cookieName] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AuthError('Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as Partial<User>;
    req.user = decoded;
  } catch (error) {
    console.error('JWT verification failed:', error); // possible issues from verifying the token (expired, invalid, etc.)
    throw new AuthError('Unauthorized: Invalid token');
  }

  if (!req.user || !req.user.id) {
    throw new AuthError('Unauthorized: Invalid user data');
  };

  next();
}
