import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { AuthService } from '../services/authService';
import type { UserResponse } from '../types/auth';

export interface AuthRequest extends Request {
  user?: UserResponse;
}

const authService = new AuthService();

/**
 * Authenticate middleware - verify JWT token
 */
export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token không được cung cấp', 401, 'TOKEN_MISSING');
    }

    const token = authHeader.substring(7);
    
    // Verify token and get user
    const user = await authService.verifyAndGetUser(token);
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
  }
};

/**
 * Authorize middleware - check user role
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401, 'NOT_AUTHENTICATED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền truy cập', 403, 'NOT_AUTHORIZED'));
    }

    next();
  };
};

/**
 * Optional authenticate - attach user if token provided, but don't fail if not
 */
export const optionalAuthenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await authService.verifyAndGetUser(token);
      req.user = user;
    }

    next();
  } catch (error) {
    // Silently fail - it's optional
    next();
  }
};

