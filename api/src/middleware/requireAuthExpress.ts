import { Response, NextFunction } from 'express';
import { AuthRequest, AuthSocket, User } from '../../types';
import { validateAndAttachUser } from "../utils";

export async function requireAuth(req: AuthRequest | AuthSocket, res: Response, next: NextFunction) {
  try {
    validateAndAttachUser( req );
    next();
  } catch (error) {
    next(error);
  }
}
