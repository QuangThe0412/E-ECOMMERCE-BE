import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, status } = req.query;
    
    const result = await this.orderService.getAllOrders(
      Number(page),
      Number(limit),
      status as string
    );
    
    return ApiResponse.paginated(
      res,
      result.data,
      Number(page),
      Number(limit),
      result.total,
      'Orders retrieved successfully'
    );
  });

  getOrderById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await this.orderService.getOrderById(id);
    
    return ApiResponse.success(res, order, 'Order retrieved successfully');
  });

  createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orderData = req.body;
    const order = await this.orderService.createOrder(orderData);
    
    return ApiResponse.success(res, order, 'Order created successfully', 201);
  });

  updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await this.orderService.updateOrderStatus(id, status);
    
    return ApiResponse.success(res, order, 'Order status updated successfully');
  });

  deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await this.orderService.deleteOrder(id);
    
    return ApiResponse.success(res, null, 'Order deleted successfully');
  });
}
