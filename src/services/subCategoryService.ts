import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from '../types/category';

export class SubCategoryService {
  async getAllSubCategories(categoryId?: number, isActive: boolean = true) {
    try {
      logger.info(`Fetching subcategories${categoryId ? ` for category: ${categoryId}` : ''}`);
      const whereClause = {
        ...(categoryId && { CategoryId: categoryId }),
        ...(isActive && { IsActive: true }),
      };

      const subCategories = await (prisma as any).subCategories.findMany({
        where: whereClause,
        include: {
          Category: true,
        },
        orderBy: { DisplayOrder: 'asc' },
      });

      return subCategories;
    } catch (error) {
      logger.error('SubCategoryService.getAllSubCategories error:', error);
      throw new AppError('Error fetching subcategories', 500);
    }
  }

  async getSubCategoryById(id: number) {
    try {
      logger.info(`Fetching subcategory with ID: ${id}`);
      const subCategory = await (prisma as any).subCategories.findUnique({
        where: { Id: id },
        include: {
          Category: true,
        },
      });

      if (!subCategory) {
        logger.warn(`SubCategory not found: ${id}`);
        throw new AppError('SubCategory not found', 404);
      }

      return subCategory;
    } catch (error) {
      logger.error('SubCategoryService.getSubCategoryById error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching subcategory', 500);
    }
  }

  async createSubCategory(data: CreateSubCategoryDTO) {
    try {
      logger.info('Creating subcategory:', data.Name);

      // Check if category exists
      const category = await (prisma as any).categories.findUnique({
        where: { Id: data.CategoryId },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if subcategory name already exists in this category
      const exists = await (prisma as any).subCategories.findFirst({
        where: {
          CategoryId: data.CategoryId,
          Name: data.Name,
        },
      });

      if (exists) {
        throw new AppError('SubCategory name already exists in this category', 400);
      }

      const subCategory = await (prisma as any).subCategories.create({
        data: {
          Name: data.Name,
          CategoryId: data.CategoryId,
          Description: data.Description || null,
          Image: data.Image || null,
          DisplayOrder: data.DisplayOrder || 0,
          IsActive: true,
        },
      });

      logger.info('SubCategory created successfully:', subCategory.Id);
      return subCategory;
    } catch (error) {
      logger.error('SubCategoryService.createSubCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating subcategory', 500);
    }
  }

  async updateSubCategory(id: number, data: UpdateSubCategoryDTO) {
    try {
      logger.info(`Updating subcategory with ID: ${id}`);

      // Check if subcategory exists
      const subCategory = await (prisma as any).subCategories.findUnique({
        where: { Id: id },
      });

      if (!subCategory) {
        throw new AppError('SubCategory not found', 404);
      }

      const updated = await (prisma as any).subCategories.update({
        where: { Id: id },
        data: {
          Name: data.Name,
          Description: data.Description,
          Image: data.Image,
          DisplayOrder: data.DisplayOrder,
          IsActive: data.IsActive,
        },
      });

      logger.info('SubCategory updated successfully:', updated.Id);
      return updated;
    } catch (error) {
      logger.error('SubCategoryService.updateSubCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating subcategory', 500);
    }
  }

  async deleteSubCategory(id: number) {
    try {
      logger.info(`Deleting subcategory with ID: ${id}`);

      // Check if subcategory exists
      const subCategory = await (prisma as any).subCategories.findUnique({
        where: { Id: id },
      });

      if (!subCategory) {
        throw new AppError('SubCategory not found', 404);
      }

      // Check if subcategory has products
      const productCount = await (prisma as any).products.count({
        where: { SubCategoryId: id },
      });

      if (productCount > 0) {
        throw new AppError('Cannot delete subcategory with existing products', 400);
      }

      await (prisma as any).subCategories.delete({
        where: { Id: id },
      });

      logger.info('SubCategory deleted successfully');
      return true;
    } catch (error) {
      logger.error('SubCategoryService.deleteSubCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting subcategory', 500);
    }
  }
}
