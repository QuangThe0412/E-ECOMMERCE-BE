import type { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import type { LoginRequest, RegisterRequest, RefreshTokenRequest, LogoutRequest } from '../types/auth';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Get client IP address
   */
  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      const firstIp = forwarded.split(',')[0];
      return firstIp ? firstIp.trim() : '0.0.0.0';
    }
    return req.socket.remoteAddress || '0.0.0.0';
  }

  /**
   * Login
   * POST /api/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const credentials: LoginRequest = req.body;
    const ipAddress = this.getClientIp(req);

    if (!credentials.username || !credentials.password) {
      return ApiResponse.error(res, 'Username and password are required', 400);
    }

    const result = await this.authService.login(credentials, ipAddress);

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  /**
   * Register
   * POST /api/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const userData: RegisterRequest = req.body;

    if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
      return ApiResponse.error(res, 'All fields are required', 400);
    }

    const result = await this.authService.register(userData);

    return res.status(201).json({
      success: true,
      data: result,
    });
  });

  /**
   * Verify Token
   * GET /api/auth/verify
   */
  verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_MISSING',
          message: 'Token không được cung cấp',
        },
      });
    }

    const token = authHeader.substring(7);
    const user = await this.authService.verifyAndGetUser(token);

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  });

  /**
   * Refresh Token
   * POST /api/auth/refresh
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken }: RefreshTokenRequest = req.body;

    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token is required', 400);
    }

    const result = await this.authService.refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  /**
   * Logout
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken }: LogoutRequest = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !refreshToken) {
      return ApiResponse.error(res, 'Token and refresh token are required', 400);
    }

    await this.authService.logout(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  });

  /**
   * Get current user
   * GET /api/auth/me
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_MISSING',
          message: 'Token không được cung cấp',
        },
      });
    }

    const token = authHeader.substring(7);
    const user = await this.authService.verifyAndGetUser(token);

    return ApiResponse.success(res, user, 'User retrieved successfully');
  });
}
