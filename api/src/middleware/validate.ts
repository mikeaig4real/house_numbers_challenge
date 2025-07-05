import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/validationError';

export const validate =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(err);
      }
      throw err;
    }
  };
