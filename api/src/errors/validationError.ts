import { ZodError } from 'zod';
import { CustomError } from './customError';
import { StatusCodes } from 'http-status-codes';

export class ValidationError extends CustomError {
  constructor(zodError?: ZodError, message?: string) {
    const flatMessage = zodError?.errors
      .map( ( err ) =>
      {
        const path = err.path.join( '.' );
        return path ? `${ path }: ${ err.message }` : err.message;
      } )
      .join( '; ' );
    super(`Validation Failed: ${flatMessage || message}`, StatusCodes.BAD_REQUEST);
  }
}
