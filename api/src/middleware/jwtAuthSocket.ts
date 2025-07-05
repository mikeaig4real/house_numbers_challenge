import { AuthSocket, User } from './../../types';
import jwt from 'jsonwebtoken';
import { config } from "../../config";
import { AuthError } from '../errors/authError';
export function jwtAuthSocket(socket: AuthSocket, next: (err?:Error) => void) {
  const cookie = socket.handshake.headers.cookie;
  if ( !cookie )
  {
    next(new AuthError('No cookie provided'));
    return;
  }
  const [cookieKey, token] = cookie.split( '=' );
  if ( cookieKey !== config.jwt.cookieName || !token ) return next(new AuthError('Invalid cookie format'));
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as Partial<User>;
    socket.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    next(new AuthError('Invalid token'));
    return;
  }
}
