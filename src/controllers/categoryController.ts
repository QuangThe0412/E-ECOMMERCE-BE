import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { ApiResponse } from '../utils/response';
import { CategoryService } from '../services/categoryService';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types/category';

const categoryService = new CategoryService();

export const categoryController = {
  /**
   * Get all categories
   * @route GET /api/categories
   */
  getAllCategories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    ApiResponse.success(res, 'Categories fetched successfully', categories, 200);
  }),

  /**
   * Get category by ID with subcategories
   * @route GET /api/categories/:id
   */
  getCategoryById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const category = await categoryService.getCategoryById(parseInt(id));
    ApiResponse.success(res, 'Category fetched successfully', category, 200);
  }),

  /**
   * Create new category
   * @route POST /api/categories
   */
  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const data: CreateCategoryDTO = req.body;
    const category = await categoryService.createCategory(data);
    ApiResponse.success(res, 'Category created successfully', category, 201);
  }),

  /**
   * Update category
   * @route PUT /api/categories/:id
   */
  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data: UpdateCategoryDTO = req.body;
    const category = await categoryService.updateCategory(parseInt(id), data);
    ApiResponse.success(res, 'Category updated successfully', category, 200);
  }),

  /**
   * Delete category
   * @route DELETE /api/categories/:id
   */
  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await categoryService.deleteCategory(parseInt(id));
    ApiResponse.success(res, 'Category deleted successfully', undefined, 200);
  }),
};
