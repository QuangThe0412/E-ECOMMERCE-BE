import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { User } from '../types/user';

export class UserService {
  async getAllUsers(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.users.findMany({
          orderBy: { CreatedAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        prisma.users.count(),
      ]);

      return {
        data: users,
        total,
      };
    } catch (error) {
      throw new AppError('Error fetching users', 500);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { Id: id },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching user', 500);
    }
  }

  async createUser(userData: Partial<User>) {
    try {
      const user = await prisma.users.create({
        data: {
          Email: userData.email!,
          Username: userData.name!, // Map name to username
          PasswordHash: userData.password!,
          Role: 'user',
        },
      });

      return user;
    } catch (error) {
      throw new AppError('Error creating user', 500);
    }
  }

  async updateUser(id: string, userData: Partial<User>) {
    try {
      const updateData: any = {};
      
      if (userData.email) {
        updateData.Email = userData.email;
      }
      if (userData.name) {
        updateData.Username = userData.name;
      }

      if (Object.keys(updateData).length === 0) {
        throw new AppError('No fields to update', 400);
      }

      const user = await prisma.users.update({
        where: { Id: id },
        data: updateData,
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating user', 500);
    }
  }

  async deleteUser(id: string) {
    try {
      // Check if user has refresh tokens
      const tokensCount = await prisma.refreshTokens.count({
        where: { UserId: id },
      });

      if (tokensCount > 0) {
        // Revoke all refresh tokens before deleting
        await prisma.refreshTokens.updateMany({
          where: { UserId: id },
          data: { Revoked: true },
        });
      }

      await prisma.users.delete({
        where: { Id: id },
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting user', 500);
    }
  }
}
