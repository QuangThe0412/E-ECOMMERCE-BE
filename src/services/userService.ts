import sql from 'mssql';
import { getPool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { User } from '../types/user';

export class UserService {
  async getAllUsers(page: number, limit: number) {
    try {
      const pool = getPool();
      const offset = (page - 1) * limit;

      const result = await pool.request()
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
          SELECT * FROM Users 
          ORDER BY CreatedAt DESC
          OFFSET @offset ROWS
          FETCH NEXT @limit ROWS ONLY
        `);

      const countResult = await pool.request()
        .query('SELECT COUNT(*) as total FROM Users');

      return {
        data: result.recordset,
        total: countResult.recordset[0]?.total || 0,
      };
    } catch (error) {
      throw new AppError('Error fetching users', 500);
    }
  }

  async getUserById(id: string) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('SELECT * FROM Users WHERE Id = @id');

      if (result.recordset.length === 0) {
        throw new AppError('User not found', 404);
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching user', 500);
    }
  }

  async createUser(userData: Partial<User>) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('email', sql.NVarChar, userData.email)
        .input('name', sql.NVarChar, userData.name)
        .input('password', sql.NVarChar, userData.password)
        .query(`
          INSERT INTO Users (Email, Name, Password, CreatedAt)
          OUTPUT INSERTED.*
          VALUES (@email, @name, @password, GETDATE())
        `);

      return result.recordset[0];
    } catch (error) {
      throw new AppError('Error creating user', 500);
    }
  }

  async updateUser(id: string, userData: Partial<User>) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .input('email', sql.NVarChar, userData.email)
        .input('name', sql.NVarChar, userData.name)
        .query(`
          UPDATE Users 
          SET Email = @email, Name = @name, UpdatedAt = GETDATE()
          OUTPUT INSERTED.*
          WHERE Id = @id
        `);

      if (result.recordset.length === 0) {
        throw new AppError('User not found', 404);
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating user', 500);
    }
  }

  async deleteUser(id: string) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('DELETE FROM Users WHERE Id = @id');

      if (result.rowsAffected[0] === 0) {
        throw new AppError('User not found', 404);
      }

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting user', 500);
    }
  }
}
