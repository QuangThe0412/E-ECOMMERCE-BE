import type { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search } = req.query;
    
    const result = await this.customerService.getAllCustomers(
      Number(page),
      Number(limit),
      search as string
    );
    
    return ApiResponse.paginated(
      res,
      result.data,
      Number(page),
      Number(limit),
      result.total,
      'Customers retrieved successfully'
    );
  });

  getCustomerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Customer ID is required', 400);
    }
    
    const customer = await this.customerService.getCustomerById(Number(id));
    
    return ApiResponse.success(res, customer, 'Customer retrieved successfully');
  });

  getCustomerByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      return ApiResponse.error(res, 'Email is required', 400);
    }
    
    const customer = await this.customerService.getCustomerByEmail(email);
    
    return ApiResponse.success(res, customer, 'Customer retrieved successfully');
  });

  createCustomer = asyncHandler(async (req: Request, res: Response) => {
    const customerData = req.body;
    const customer = await this.customerService.createCustomer(customerData);
    
    return ApiResponse.success(res, customer, 'Customer created successfully', 201);
  });

  updateCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Customer ID is required', 400);
    }
    
    const customerData = req.body;
    const customer = await this.customerService.updateCustomer(Number(id), customerData);
    
    return ApiResponse.success(res, customer, 'Customer updated successfully');
  });

  deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Customer ID is required', 400);
    }
    
    await this.customerService.deleteCustomer(Number(id));
    
    return ApiResponse.success(res, null, 'Customer deleted successfully');
  });

  getCustomerOrders = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    if (!id) {
      return ApiResponse.error(res, 'Customer ID is required', 400);
    }
    
    const result = await this.customerService.getCustomerOrders(
      Number(id),
      Number(page),
      Number(limit)
    );
    
    return ApiResponse.paginated(
      res,
      result.data,
      Number(page),
      Number(limit),
      result.total,
      'Customer orders retrieved successfully'
    );
  });
}
