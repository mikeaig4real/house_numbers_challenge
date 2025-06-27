import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'something_complex';
const COOKIE_NAME = 'snipify_token';
export function jwtAuthSocket(socket: Socket, next: (err?:Error) => void) {
  const cookie = socket.handshake.headers.cookie;
  if ( !cookie ) return next();
  const [cookieKey, token] = cookie.split( '=' );
  if ( cookieKey !== COOKIE_NAME || !token ) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(error as Error);
  }
}
