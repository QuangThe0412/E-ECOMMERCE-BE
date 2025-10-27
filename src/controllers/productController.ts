import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search, category } = req.query;
    
    const result = await this.productService.getAllProducts(
      Number(page),
      Number(limit),
      search as string,
      category as string
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

  getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    
    return ApiResponse.success(res, product, 'Product retrieved successfully');
  });

  createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body;
    const product = await this.productService.createProduct(productData);
    
    return ApiResponse.success(res, product, 'Product created successfully', 201);
  });

  updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const productData = req.body;
    const product = await this.productService.updateProduct(id, productData);
    
    return ApiResponse.success(res, product, 'Product updated successfully');
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await this.productService.deleteProduct(id);
    
    return ApiResponse.success(res, null, 'Product deleted successfully');
  });
}
