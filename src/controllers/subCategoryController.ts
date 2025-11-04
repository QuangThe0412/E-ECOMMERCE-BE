import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { ApiResponse } from '../utils/response';
import { SubCategoryService } from '../services/subCategoryService';
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from '../types/category';

const subCategoryService = new SubCategoryService();

export const subCategoryController = {
  /**
   * Get all subcategories with optional category filter
   * @route GET /api/subcategories
   */
  getAllSubCategories: asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.query;
    const subCategories = await subCategoryService.getAllSubCategories(
      categoryId ? parseInt(categoryId as string) : undefined
    );
    ApiResponse.success(res, 'SubCategories fetched successfully', subCategories, 200);
  }),

  /**
   * Get subcategory by ID with products
   * @route GET /api/subcategories/:id
   */
  getSubCategoryById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const subCategory = await subCategoryService.getSubCategoryById(parseInt(id));
    ApiResponse.success(res, 'SubCategory fetched successfully', subCategory, 200);
  }),

  /**
   * Create new subcategory
   * @route POST /api/subcategories
   */
  createSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const data: CreateSubCategoryDTO = req.body;
    const subCategory = await subCategoryService.createSubCategory(data);
    ApiResponse.success(res, 'SubCategory created successfully', subCategory, 201);
  }),

  /**
   * Update subcategory
   * @route PUT /api/subcategories/:id
   */
  updateSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data: UpdateSubCategoryDTO = req.body;
    const subCategory = await subCategoryService.updateSubCategory(parseInt(id), data);
    ApiResponse.success(res, 'SubCategory updated successfully', subCategory, 200);
  }),

  /**
   * Delete subcategory
   * @route DELETE /api/subcategories/:id
   */
  deleteSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await subCategoryService.deleteSubCategory(parseInt(id));
    ApiResponse.success(res, 'SubCategory deleted successfully', undefined, 200);
  }),
};
