import { CustomError } from './customError';
import { StatusCodes } from 'http-status-codes';

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(`Bad Request: ${message}`, StatusCodes.BAD_REQUEST);
  }
}