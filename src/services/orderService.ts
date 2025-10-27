import sql from 'mssql';
import { getPool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { Order } from '../types/order';

export class OrderService {
  async getAllOrders(page: number, limit: number, status?: string) {
    try {
      const pool = getPool();
      const offset = (page - 1) * limit;

      let query = `
        SELECT * FROM Orders 
        WHERE 1=1
      `;

      if (status) {
        query += ` AND Status = @status`;
      }

      query += `
        ORDER BY CreatedAt DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;

      const request = pool.request()
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset);

      if (status) {
        request.input('status', sql.NVarChar, status);
      }

      const result = await request.query(query);

      let countQuery = 'SELECT COUNT(*) as total FROM Orders WHERE 1=1';
      
      if (status) {
        countQuery += ` AND Status = @status`;
      }

      const countRequest = pool.request();
      
      if (status) {
        countRequest.input('status', sql.NVarChar, status);
      }

      const countResult = await countRequest.query(countQuery);

      return {
        data: result.recordset,
        total: countResult.recordset[0]?.total || 0,
      };
    } catch (error) {
      throw new AppError('Error fetching orders', 500);
    }
  }

  async getOrderById(id: string) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('SELECT * FROM Orders WHERE Id = @id');

      if (result.recordset.length === 0) {
        throw new AppError('Order not found', 404);
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching order', 500);
    }
  }

  async createOrder(orderData: Partial<Order>) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('userId', sql.NVarChar, orderData.userId)
        .input('totalAmount', sql.Decimal(18, 2), orderData.totalAmount)
        .input('status', sql.NVarChar, 'pending')
        .query(`
          INSERT INTO Orders (UserId, TotalAmount, Status, CreatedAt)
          OUTPUT INSERTED.*
          VALUES (@userId, @totalAmount, @status, GETDATE())
        `);

      return result.recordset[0];
    } catch (error) {
      throw new AppError('Error creating order', 500);
    }
  }

  async updateOrderStatus(id: string, status: string) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .input('status', sql.NVarChar, status)
        .query(`
          UPDATE Orders 
          SET Status = @status, UpdatedAt = GETDATE()
          OUTPUT INSERTED.*
          WHERE Id = @id
        `);

      if (result.recordset.length === 0) {
        throw new AppError('Order not found', 404);
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating order status', 500);
    }
  }

  async deleteOrder(id: string) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('DELETE FROM Orders WHERE Id = @id');

      if (result.rowsAffected[0] === 0) {
        throw new AppError('Order not found', 404);
      }

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting order', 500);
    }
  }
}
