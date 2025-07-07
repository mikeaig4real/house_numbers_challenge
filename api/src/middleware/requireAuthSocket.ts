import { AuthSocket, User } from '../../types';
import { NextFunction } from '../../types';
import { AuthError } from '../errors/authError';
import { validateAndAttachUser } from '../utils';
export async function requireAuth(socket: AuthSocket, next: NextFunction) {
  try {
    validateAndAttachUser(socket);
    next();
  } catch (error) {
    next(error);
  }
}
