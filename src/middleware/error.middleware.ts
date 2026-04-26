import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (err instanceof ZodError) {
    return res.status(422).json({
      errors: err.errors.reduce((acc, e) => {
        acc[e.path.join('.')] = [e.message];
        return acc;
      }, {} as Record<string, string[]>),
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = [err.errors[key].message];
        return acc;
      }, {} as Record<string, string[]>),
    });
  }

  res.status(err.status || 500).json({
    errors: { body: [err.message || 'Internal server error'] },
  });
};
