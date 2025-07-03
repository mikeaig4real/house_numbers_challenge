import { AuthSocket, User } from './../../types';
import jwt from 'jsonwebtoken';
import { config } from "../../config";
export function jwtAuthSocket(socket: AuthSocket, next: (err?:Error) => void) {
  const cookie = socket.handshake.headers.cookie;
  if ( !cookie ) return next();
  const [cookieKey, token] = cookie.split( '=' );
  if ( cookieKey !== config.jwt.cookieName || !token ) return next();
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as Partial<User>;
    socket.user = decoded;
    next();
  } catch (error) {
    next(error as Error);
  }
}
