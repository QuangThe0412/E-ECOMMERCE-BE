import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types/product';

export class ProductService {
  /**
   * Get all products with pagination, search, and filter
   */
  async getAllProducts(page: number, limit: number, search?: string, category?: string) {
    try {
      const offset = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { Name: { contains: search } },
          { Description: { contains: search } },
        ];
      }

      if (category) {
        where.Category = category;
      }

      // Execute queries in parallel
      const [data, total] = await Promise.all([
        prisma.products.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: {
            Id: 'desc',
          },
        }),
        prisma.products.count({ where }),
      ]);

      return {
        data,
        total,
      };
    } catch (error) {
      console.error('ProductService.getAllProducts error:', error);
      throw new AppError('Error fetching products', 500);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number) {
    try {
      const product = await prisma.products.findUnique({
        where: { Id: id },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      return product as unknown as Product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('ProductService.getProductById error:', error);
      throw new AppError('Error fetching product', 500);
    }
  }

  /**
   * Create new product
   */
  async createProduct(productData: CreateProductDTO) {
    try {
      const product = await prisma.products.create({
        data: {
          Name: productData.Name,
          Description: productData.Description || null,
          Image: productData.Image || null,
          Category: productData.Category || null,
          Price: productData.Price,
          OriginalPrice: productData.OriginalPrice || null,
          Stock: productData.Stock,
          Rating: productData.Rating || null,
          Reviews: productData.Reviews || 0,
          Colors: productData.Colors || null,
          Sizes: productData.Sizes || null,
        },
      });

      return product as unknown as Product;
    } catch (error) {
      console.error('ProductService.createProduct error:', error);
      throw new AppError('Error creating product', 500);
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: number, productData: UpdateProductDTO) {
    try {
      // Check if product exists
      await this.getProductById(id);

      // Build update data - only include defined fields
      const updateData: any = {};

      if (productData.Name !== undefined) updateData.Name = productData.Name;
      if (productData.Description !== undefined) updateData.Description = productData.Description;
      if (productData.Image !== undefined) updateData.Image = productData.Image;
      if (productData.Category !== undefined) updateData.Category = productData.Category;
      if (productData.Price !== undefined) updateData.Price = productData.Price;
      if (productData.OriginalPrice !== undefined) updateData.OriginalPrice = productData.OriginalPrice;
      if (productData.Stock !== undefined) updateData.Stock = productData.Stock;
      if (productData.Rating !== undefined) updateData.Rating = productData.Rating;
      if (productData.Reviews !== undefined) updateData.Reviews = productData.Reviews;
      if (productData.Colors !== undefined) updateData.Colors = productData.Colors;
      if (productData.Sizes !== undefined) updateData.Sizes = productData.Sizes;

      if (Object.keys(updateData).length === 0) {
        throw new AppError('No fields to update', 400);
      }

      const product = await prisma.products.update({
        where: { Id: id },
        data: updateData,
      });

      return product as unknown as Product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('ProductService.updateProduct error:', error);
      throw new AppError('Error updating product', 500);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number) {
    try {
      // Check if product exists
      await this.getProductById(id);

      // Check if product is in any orders
      const orderItemsCount = await prisma.orderItems.count({
        where: { ProductId: id },
      });

      if (orderItemsCount > 0) {
        throw new AppError('Cannot delete product that exists in orders', 400);
      }

      await prisma.products.delete({
        where: { Id: id },
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('ProductService.deleteProduct error:', error);
      throw new AppError('Error deleting product', 500);
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, page: number, limit: number) {
    return this.getAllProducts(page, limit, undefined, category);
  }

  /**
   * Update product stock
   */
  async updateProductStock(id: number, quantity: number) {
    try {
      const product = await this.getProductById(id);

      const newStock = product.Stock + quantity;
      if (newStock < 0) {
        throw new AppError('Insufficient stock', 400);
      }

      const updatedProduct = await prisma.products.update({
        where: { Id: id },
        data: { Stock: newStock },
      });

      return updatedProduct as unknown as Product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('ProductService.updateProductStock error:', error);
      throw new AppError('Error updating product stock', 500);
    }
  }
}
