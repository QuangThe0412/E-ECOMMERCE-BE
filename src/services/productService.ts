import sql from 'mssql';
import { getPool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { Product } from '../types/product';

export class ProductService {
  async getAllProducts(page: number, limit: number, search?: string, category?: string) {
    try {
      const pool = getPool();
      const offset = (page - 1) * limit;

      let query = `
        SELECT * FROM Products 
        WHERE 1=1
      `;

      if (search) {
        query += ` AND (Name LIKE @search OR Description LIKE @search)`;
      }

      if (category) {
        query += ` AND Category = @category`;
      }

      query += `
        ORDER BY CreatedAt DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;

      const request = pool.request()
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset);

      if (search) {
        request.input('search', sql.NVarChar, `%${search}%`);
      }

      if (category) {
        request.input('category', sql.NVarChar, category);
      }

      const result = await request.query(query);

      let countQuery = 'SELECT COUNT(*) as total FROM Products WHERE 1=1';
      
      if (search) {
        countQuery += ` AND (Name LIKE @search OR Description LIKE @search)`;
      }

      if (category) {
        countQuery += ` AND Category = @category`;
      }

      const countRequest = pool.request();
      
      if (search) {
        countRequest.input('search', sql.NVarChar, `%${search}%`);
      }

      if (category) {
        countRequest.input('category', sql.NVarChar, category);
      }

      const countResult = await countRequest.query(countQuery);

      return {
        data: result.recordset,
        total: countResult.recordset[0]?.total || 0,
      };
    } catch (error) {
      throw new AppError('Error fetching products', 500);
    }
  }

  async getProductById(id: string) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('SELECT * FROM Products WHERE Id = @id');

      if (result.recordset.length === 0) {
        throw new AppError('Product not found', 404);
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching product', 500);
    }
  }

  async createProduct(productData: Partial<Product>) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('name', sql.NVarChar, productData.name)
        .input('description', sql.NVarChar, productData.description)
        .input('price', sql.Decimal(18, 2), productData.price)
        .input('stock', sql.Int, productData.stock)
        .input('category', sql.NVarChar, productData.category)
        .query(`
          INSERT INTO Products (Name, Description, Price, Stock, Category, CreatedAt)
          OUTPUT INSERTED.*
          VALUES (@name, @description, @price, @stock, @category, GETDATE())
        `);

      return result.recordset[0];
    } catch (error) {
      throw new AppError('Error creating product', 500);
    }
  }

  async updateProduct(id: string, productData: Partial<Product>) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .input('name', sql.NVarChar, productData.name)
        .input('description', sql.NVarChar, productData.description)
        .input('price', sql.Decimal(18, 2), productData.price)
        .input('stock', sql.Int, productData.stock)
        .input('category', sql.NVarChar, productData.category)
        .query(`
          UPDATE Products 
          SET Name = @name, Description = @description, Price = @price, 
              Stock = @stock, Category = @category, UpdatedAt = GETDATE()
          OUTPUT INSERTED.*
          WHERE Id = @id
        `);

      if (result.recordset.length === 0) {
        throw new AppError('Product not found', 404);
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating product', 500);
    }
  }

  async deleteProduct(id: string) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('DELETE FROM Products WHERE Id = @id');

      if (result.rowsAffected[0] === 0) {
        throw new AppError('Product not found', 404);
      }

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting product', 500);
    }
  }
}
