import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types/category';

export class CategoryService {
  async getAllCategories(isActive: boolean = true) {
    try {
      logger.info('Fetching all categories');
      const categories = await (prisma as any).categories.findMany({
        where: isActive ? { IsActive: true } : {},
        include: {
          SubCategories: {
            where: { IsActive: true },
            orderBy: { DisplayOrder: 'asc' },
          },
        },
        orderBy: { DisplayOrder: 'asc' },
      });

      return categories;
    } catch (error) {
      logger.error('CategoryService.getAllCategories error:', error);
      throw new AppError('Error fetching categories', 500);
    }
  }

  async getCategoryById(id: number) {
    try {
      logger.info(`Fetching category with ID: ${id}`);
      const category = await (prisma as any).categories.findUnique({
        where: { Id: id },
        include: {
          SubCategories: {
            where: { IsActive: true },
            orderBy: { DisplayOrder: 'asc' },
          },
        },
      });

      if (!category) {
        logger.warn(`Category not found: ${id}`);
        throw new AppError('Category not found', 404);
      }

      return category;
    } catch (error) {
      logger.error('CategoryService.getCategoryById error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching category', 500);
    }
  }

  async createCategory(data: CreateCategoryDTO) {
    try {
      logger.info('Creating category:', data.Name);

      // Check if category name already exists
      const exists = await (prisma as any).categories.findFirst({
        where: { Name: data.Name },
      });

      if (exists) {
        throw new AppError('Category name already exists', 400);
      }

      const category = await (prisma as any).categories.create({
        data: {
          Name: data.Name,
          Description: data.Description || null,
          Image: data.Image || null,
          DisplayOrder: data.DisplayOrder || 0,
          IsActive: true,
        },
      });

      logger.info('Category created successfully:', category.Id);
      return category;
    } catch (error) {
      logger.error('CategoryService.createCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating category', 500);
    }
  }

  async updateCategory(id: number, data: UpdateCategoryDTO) {
    try {
      logger.info(`Updating category with ID: ${id}`);

      // Check if category exists
      const category = await (prisma as any).categories.findUnique({
        where: { Id: id },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if new name already exists
      if (data.Name && data.Name !== category.Name) {
        const exists = await (prisma as any).categories.findFirst({
          where: { Name: data.Name },
        });

        if (exists) {
          throw new AppError('Category name already exists', 400);
        }
      }

      const updated = await (prisma as any).categories.update({
        where: { Id: id },
        data: {
          Name: data.Name,
          Description: data.Description,
          Image: data.Image,
          DisplayOrder: data.DisplayOrder,
          IsActive: data.IsActive,
        },
      });

      logger.info('Category updated successfully:', updated.Id);
      return updated;
    } catch (error) {
      logger.error('CategoryService.updateCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating category', 500);
    }
  }

  async deleteCategory(id: number) {
    try {
      logger.info(`Deleting category with ID: ${id}`);

      // Check if category exists
      const category = await (prisma as any).categories.findUnique({
        where: { Id: id },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if category has subcategories
      const subCategoryCount = await (prisma as any).subCategories.count({
        where: { CategoryId: id },
      });

      if (subCategoryCount > 0) {
        throw new AppError('Cannot delete category with existing subcategories', 400);
      }

      await (prisma as any).categories.delete({
        where: { Id: id },
      });

      logger.info('Category deleted successfully');
      return true;
    } catch (error) {
      logger.error('CategoryService.deleteCategory error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting category', 500);
    }
  }
}
