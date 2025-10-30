import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import type {
  User,
  UserResponse,
  LoginRequest,
  RegisterRequest,
  JWTPayload,
  UserRole,
} from '../types/auth';
import type { Users } from '@prisma/client';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  private readonly REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  private readonly BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS) : 10;

  /**
   * Convert Prisma Users to App User type
   */
  private toUser(userRecord: Users): User {
    const user: User = {
      id: userRecord.Id,
      username: userRecord.Username,
      email: userRecord.Email || '',
      passwordHash: userRecord.PasswordHash,
      role: userRecord.Role as UserRole,
      isActive: userRecord.IsActive ?? true,
      emailVerified: userRecord.EmailVerified ?? false,
      createdAt: userRecord.CreatedAt ?? new Date(),
      updatedAt: userRecord.UpdatedAt ?? new Date(),
    };
    
    if (userRecord.LastLogin) {
      user.lastLogin = userRecord.LastLogin;
    }
    
    return user;
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(user: User): string {
    const payload: JWTPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token đã hết hạn', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Token không hợp lệ', 401, 'TOKEN_INVALID');
    }
  }

  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_ROUNDS);
  }

  /**
   * Compare password
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Convert User to UserResponse (remove sensitive data)
   */
  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  /**
   * Calculate token expiration date
   */
  private getTokenExpirationDate(expiresIn: string): Date {
    const matches = expiresIn.match(/^(\d+)([dhm])$/);
    if (!matches || !matches[1]) {
      throw new Error('Invalid expiration format');
    }

    const value = parseInt(matches[1]);
    const unit = matches[2];

    const now = new Date();
    switch (unit) {
      case 'd':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'm':
        return new Date(now.getTime() + value * 60 * 1000);
      default:
        throw new Error('Invalid expiration unit');
    }
  }

  /**
   * Save refresh token to database
   */
  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    try {
      const expiresAt = this.getTokenExpirationDate(this.REFRESH_TOKEN_EXPIRES_IN);

      await prisma.refreshTokens.create({
        data: {
          UserId: userId,
          Token: token,
          ExpiresAt: expiresAt,
        },
      });
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw new AppError('Error saving refresh token', 500);
    }
  }

  /**
   * Log login attempt
   */
  async logLoginAttempt(ipAddress: string, username: string, success: boolean): Promise<void> {
    try {
      await prisma.loginAttempts.create({
        data: {
          IpAddress: ipAddress,
          Username: username,
          Success: success,
        },
      });
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  }

  /**
   * Check rate limiting
   */
  async checkRateLimit(ipAddress: string): Promise<boolean> {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      const attempts = await prisma.loginAttempts.count({
        where: {
          IpAddress: ipAddress,
          Success: false,
          AttemptedAt: {
            gt: fifteenMinutesAgo,
          },
        },
      });

      return attempts < 5;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return true; // Allow login if rate limit check fails
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest, ipAddress: string): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    try {
      // Check rate limiting
      const canAttempt = await this.checkRateLimit(ipAddress);
      if (!canAttempt) {
        throw new AppError(
          'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút',
          429,
          'TOO_MANY_ATTEMPTS'
        );
      }

      // Use phone as username for lookup
      const userRecord = await prisma.users.findUnique({
        where: { Username: credentials.phone },
      });

      if (!userRecord) {
        await this.logLoginAttempt(ipAddress, credentials.phone, false);
        throw new AppError('Số điện thoại hoặc mật khẩu không đúng', 401, 'INVALID_CREDENTIALS');
      }

      const user = this.toUser(userRecord);

      // Check if user is active
      if (!user.isActive) {
        await this.logLoginAttempt(ipAddress, credentials.phone, false);
        throw new AppError('Tài khoản bị khóa', 403, 'USER_INACTIVE');
      }

      // Verify password
      const isValidPassword = await this.comparePassword(credentials.password, user.passwordHash);
      if (!isValidPassword) {
        await this.logLoginAttempt(ipAddress, credentials.phone, false);
        throw new AppError('Số điện thoại hoặc mật khẩu không đúng', 401, 'INVALID_CREDENTIALS');
      }

      // Update last login
      await prisma.users.update({
        where: { Id: user.id },
        data: { LastLogin: new Date() },
      });

      // Log successful login
      await this.logLoginAttempt(ipAddress, credentials.phone, true);

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token
      await this.saveRefreshToken(user.id, refreshToken);

      return {
        token: accessToken,
        refreshToken,
        user: this.toUserResponse(user),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Login error:', error);
      throw new AppError('Error during login', 500);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    try {
      // Validate required fields
      if (!userData.phone) {
        throw new AppError('Số điện thoại là bắt buộc', 400, 'PHONE_REQUIRED');
      }

      if (!userData.password) {
        throw new AppError('Mật khẩu là bắt buộc', 400, 'PASSWORD_REQUIRED');
      }

      // Validate password strength
      if (userData.password.length < 6) {
        throw new AppError('Mật khẩu phải có ít nhất 6 ký tự', 400, 'WEAK_PASSWORD');
      }

      // Use phone as username
      const username = userData.phone;

      // Check if phone/username already exists
      const existingUser = await prisma.users.findUnique({
        where: { Username: username },
      });

      if (existingUser) {
        throw new AppError('Số điện thoại đã được đăng ký', 409, 'PHONE_EXISTS');
      }

      // Hash password
      const passwordHash = await this.hashPassword(userData.password);

      // Email is optional, can be null
      const email = 'test@123.com';

      // Create user
      const newUserRecord = await prisma.users.create({
        data: {
          Username: username,        // Phone number as username
          Email: email,              // Can be null
          Phone: userData.phone,     // Store phone separately
          PasswordHash: passwordHash,
          Role: 'user',
        } as any, // Temporary fix until Prisma Client regenerates
      });

      const newUser = this.toUser(newUserRecord);

      // Generate tokens
      const accessToken = this.generateAccessToken(newUser);
      const refreshToken = this.generateRefreshToken(newUser);

      // Save refresh token
      await this.saveRefreshToken(newUser.id, refreshToken);

      return {
        token: accessToken,
        refreshToken,
        user: this.toUserResponse(newUser),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Registration error:', error);
      throw new AppError('Error during registration', 500);
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = this.verifyToken(refreshToken);

      // Check if refresh token exists and is not revoked
      const tokenRecord = await prisma.refreshTokens.findFirst({
        where: {
          Token: refreshToken,
          UserId: payload.sub,
          Revoked: false,
          ExpiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!tokenRecord) {
        throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn', 401, 'REFRESH_TOKEN_EXPIRED');
      }

      // Get user
      const userRecord = await prisma.users.findFirst({
        where: {
          Id: payload.sub,
          IsActive: true,
        },
      });

      if (!userRecord) {
        throw new AppError('User không tồn tại', 404, 'USER_NOT_FOUND');
      }

      const user = this.toUser(userRecord);

      // Revoke old refresh token
      await prisma.refreshTokens.update({
        where: { Id: tokenRecord.Id },
        data: { Revoked: true },
      });

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Save new refresh token
      await this.saveRefreshToken(user.id, newRefreshToken);

      return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Token refresh error:', error);
      throw new AppError('Error refreshing token', 500);
    }
  }

  /**
   * Verify and get user from token
   */
  async verifyAndGetUser(token: string): Promise<UserResponse> {
    try {
      const payload = this.verifyToken(token);

      const userRecord = await prisma.users.findFirst({
        where: {
          Id: payload.sub,
          IsActive: true,
        },
      });

      if (!userRecord) {
        throw new AppError('User không tồn tại', 404, 'USER_NOT_FOUND');
      }

      const user = this.toUser(userRecord);

      return this.toUserResponse(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Token verification error:', error);
      throw new AppError('Error verifying token', 500);
    }
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      // Revoke refresh token
      await prisma.refreshTokens.updateMany({
        where: { Token: refreshToken },
        data: { Revoked: true },
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw new AppError('Error during logout', 500);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRecord = await prisma.users.findUnique({
        where: { Id: userId },
      });

      if (!userRecord) {
        return null;
      }

      return this.toUser(userRecord);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new AppError('Error fetching user', 500);
    }
  }
}
