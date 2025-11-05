import type { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, subCategoryId, category } = req.query;
    
    // If category name provided, use category filter
    if (category) {
      const result = await this.productService.getProductsByCategory(
        category as string,
        Number(page),
        Number(limit)
      );
      
      return ApiResponse.paginated(
        res,
        result.data,
        Number(page),
        Number(limit),
        result.total,
        'Products retrieved successfully'
      );
    }
    
    const result = await this.productService.getAllProducts(
      Number(page),
      Number(limit),
      search as string,
      subCategoryId ? Number(subCategoryId) : undefined
    );
    
    return ApiResponse.paginated(
      res,
      result.data,
      Number(page),
      Number(limit),
      result.total,
      'Products retrieved successfully'
    );
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Product ID is required', 400);
    }
    
    const product = await this.productService.getProductById(Number(id));
    
    return ApiResponse.success(res, product, 'Product retrieved successfully');
  });

  getProductsBySubCategory = asyncHandler(async (req: Request, res: Response) => {
    const { subCategoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!subCategoryId) {
      return ApiResponse.error(res, 'SubCategory ID is required', 400);
    }

    const result = await this.productService.getProductsBySubCategory(
      Number(subCategoryId),
      Number(page),
      Number(limit)
    );

    return ApiResponse.paginated(
      res,
      result.data,
      Number(page),
      Number(limit),
      result.total,
      'Products by subcategory retrieved successfully'
    );
  });

  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const productData = req.body;
    const product = await this.productService.createProduct(productData);
    
    return ApiResponse.success(res, product, 'Product created successfully', 201);
  });

  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Product ID is required', 400);
    }
    
    const productData = req.body;
    const product = await this.productService.updateProduct(Number(id), productData);
    
    return ApiResponse.success(res, product, 'Product updated successfully');
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Product ID is required', 400);
    }
    
    await this.productService.deleteProduct(Number(id));
    
    return ApiResponse.success(res, null, 'Product deleted successfully');
  });
}
