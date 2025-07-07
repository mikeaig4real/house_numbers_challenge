import { CustomError } from './customError';
import { StatusCodes } from 'http-status-codes';

export class AuthError extends CustomError {
  constructor(message: string) {
    super(`Unauthorized: ${message}`, StatusCodes.UNAUTHORIZED);
  }
}
