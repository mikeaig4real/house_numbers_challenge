import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from "../../config";

export function jwtAuthSocket(socket: Socket, next: (err?:Error) => void) {
  const cookie = socket.handshake.headers.cookie;
  if ( !cookie ) return next();
  const [cookieKey, token] = cookie.split( '=' );
  if ( cookieKey !== config.jwt.cookieName || !token ) return next();
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    socket.user = decoded;
    next();
  } catch (error) {
    next(error as Error);
  }
}
