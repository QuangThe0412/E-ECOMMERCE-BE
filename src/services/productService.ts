import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import type { CreateProductDTO, UpdateProductDTO } from '../types/category';

export class ProductService {
  /**
   * Get all products with pagination, search, and filter by subcategory
   */
  async getAllProducts(page: number, limit: number, search?: string, subCategoryId?: number) {
    try {
      logger.info(`Fetching products - page: ${page}, limit: ${limit}`);
      const offset = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { Name: { contains: search } },
          { Description: { contains: search } },
        ];
      }

      if (subCategoryId) {
        where.SubCategoryId = subCategoryId;
      }

      // Execute queries in parallel
      const [data, total] = await Promise.all([
        (prisma as any).products.findMany({
          where,
          skip: offset,
          take: limit,
          include: {
            SubCategory: {
              include: {
                Category: true,
              },
            },
          },
          orderBy: {
            Id: 'desc',
          },
        }),
        (prisma as any).products.count({ where }),
      ]);

      return {
        data,
        total,
      };
    } catch (error) {
      logger.error('ProductService.getAllProducts error:', error);
      throw new AppError('Error fetching products', 500);
    }
  }

  /**
   * Get product by ID with full category hierarchy
   */
  async getProductById(id: number) {
    try {
      logger.info(`Fetching product with ID: ${id}`);

      const product = await (prisma as any).products.findUnique({
        where: { Id: id },
        include: {
          SubCategory: {
            include: {
              Category: true,
            },
          },
        },
      });

      if (!product) {
        logger.warn(`Product not found: ${id}`);
        throw new AppError('Product not found', 404);
      }

      return product;
    } catch (error) {
      logger.error('ProductService.getProductById error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching product', 500);
    }
  }

  /**
   * Get products by category name
   */
  async getProductsByCategory(categoryName: string, page: number = 1, limit: number = 10) {
    try {
      logger.info(`Fetching products for category: ${categoryName}`);
      const offset = (page - 1) * limit;

      // Check if category exists
      const category = await (prisma as any).categories.findFirst({
        where: { Name: categoryName },
      });

      if (!category) {
        logger.warn(`Category not found: ${categoryName}`);
        throw new AppError('Category not found', 404);
      }

      // Get all subcategories for this category
      const subCategories = await (prisma as any).subCategories.findMany({
        where: { CategoryId: category.Id },
        select: { Id: true },
      });

      const subCategoryIds = subCategories.map((sc: any) => sc.Id);

      // If no subcategories, return empty result
      if (subCategoryIds.length === 0) {
        return { data: [], total: 0 };
      }

      const [data, total] = await Promise.all([
        (prisma as any).products.findMany({
          where: { SubCategoryId: { in: subCategoryIds } },
          skip: offset,
          take: limit,
          include: {
            SubCategory: {
              include: {
                Category: true,
              },
            },
          },
          orderBy: { Id: 'desc' },
        }),
        (prisma as any).products.count({
          where: { SubCategoryId: { in: subCategoryIds } },
        }),
      ]);

      return { data, total };
    } catch (error) {
      logger.error('ProductService.getProductsByCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching products by category', 500);
    }
  }

  /**
   * Get products by subcategory
   */
  async getProductsBySubCategory(subCategoryId: number, page: number = 1, limit: number = 10) {
    try {
      logger.info(`Fetching products for subcategory: ${subCategoryId}`);
      const offset = (page - 1) * limit;

      // Check if subcategory exists
      const subCategory = await (prisma as any).subCategories.findUnique({
        where: { Id: subCategoryId },
      });

      if (!subCategory) {
        throw new AppError('SubCategory not found', 404);
      }

      const [data, total] = await Promise.all([
        (prisma as any).products.findMany({
          where: { SubCategoryId: subCategoryId },
          skip: offset,
          take: limit,
          include: {
            SubCategory: {
              include: {
                Category: true,
              },
            },
          },
          orderBy: { Id: 'desc' },
        }),
        (prisma as any).products.count({
          where: { SubCategoryId: subCategoryId },
        }),
      ]);

      return { data, total };
    } catch (error) {
      logger.error('ProductService.getProductsBySubCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching products by subcategory', 500);
    }
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductDTO) {
    try {
      logger.info('Creating product:', data.Name);

      // Validate subcategory exists
      const subCategory = await (prisma as any).subCategories.findUnique({
        where: { Id: data.SubCategoryId },
      });

      if (!subCategory) {
        throw new AppError('SubCategory not found', 404);
      }

      // Validate product name is unique
      const exists = await (prisma as any).products.findFirst({
        where: { Name: data.Name },
      });

      if (exists) {
        throw new AppError('Product name already exists', 400);
      }

      const product = await (prisma as any).products.create({
        data: {
          Name: data.Name,
          Description: data.Description || null,
          Image: data.Image || null,
          Price: data.Price,
          OriginalPrice: data.OriginalPrice || null,
          Stock: data.Stock,
          SubCategoryId: data.SubCategoryId,
          Colors: data.Colors || null,
          Sizes: data.Sizes || null,
        },
        include: {
          SubCategory: {
            include: {
              Category: true,
            },
          },
        },
      });

      logger.info('Product created successfully:', product.Id);
      return product;
    } catch (error) {
      logger.error('ProductService.createProduct error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating product', 500);
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: number, data: UpdateProductDTO) {
    try {
      logger.info(`Updating product with ID: ${id}`);

      // Check product exists
      const product = await (prisma as any).products.findUnique({
        where: { Id: id },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Validate new subcategory if provided
      if (data.SubCategoryId) {
        const subCategory = await (prisma as any).subCategories.findUnique({
          where: { Id: data.SubCategoryId },
        });

        if (!subCategory) {
          throw new AppError('SubCategory not found', 404);
        }
      }

      const updated = await (prisma as any).products.update({
        where: { Id: id },
        data: {
          Name: data.Name,
          Description: data.Description,
          Image: data.Image,
          Price: data.Price,
          OriginalPrice: data.OriginalPrice,
          Stock: data.Stock,
          SubCategoryId: data.SubCategoryId,
          Colors: data.Colors,
          Sizes: data.Sizes,
        },
        include: {
          SubCategory: {
            include: {
              Category: true,
            },
          },
        },
      });

      logger.info('Product updated successfully:', updated.Id);
      return updated;
    } catch (error) {
      logger.error('ProductService.updateProduct error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating product', 500);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number) {
    try {
      logger.info(`Deleting product with ID: ${id}`);

      // Check product exists
      const product = await (prisma as any).products.findUnique({
        where: { Id: id },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Check if product has order items
      const orderItemsCount = await (prisma as any).orderItems.count({
        where: { ProductId: id },
      });

      if (orderItemsCount > 0) {
        throw new AppError('Cannot delete product with existing orders', 400);
      }

      await (prisma as any).products.delete({
        where: { Id: id },
      });

      logger.info('Product deleted successfully');
      return true;
    } catch (error) {
      logger.error('ProductService.deleteProduct error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting product', 500);
    }
  }
}
