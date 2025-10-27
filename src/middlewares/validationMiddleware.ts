import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../validators/validators';
import { ApiResponse } from '../utils/response';

export const validateRequest = (errors: ValidationError[]) => {
  return (_req: Request, res: Response, next: NextFunction): void => {
    if (errors.length > 0) {
      ApiResponse.error(res, 'Validation failed', 400, errors);
      return;
    }
    next();
  };
};

export const validateBody = (validator: (data: any) => ValidationError[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors = validator(req.body);
    if (errors.length > 0) {
      ApiResponse.error(res, 'Validation failed', 400, errors);
      return;
    }
    next();
  };
};
