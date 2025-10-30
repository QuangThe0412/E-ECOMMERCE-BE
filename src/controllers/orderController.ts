import type { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import type { AuthRequest } from '../middlewares/authMiddleware';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
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

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Order ID is required', 400);
    }
    
    const order = await this.orderService.getOrderById(Number(id));
    
    return ApiResponse.success(res, order, 'Order retrieved successfully');
  });

  getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const { page = 1, limit = 10 } = req.query;

    const result = await this.orderService.getUserOrders(
      userId,
      Number(page),
      Number(limit)
    );

    return ApiResponse.paginated(
      res,
      result.data,
      Number(page),
      Number(limit),
      result.total,
      'User orders retrieved successfully'
    );
  });

  createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const orderData = {
      ...req.body,
      UserId: userId,
    };

    const order = await this.orderService.createOrder(orderData);
    
    return ApiResponse.success(res, order, 'Order created successfully', 201);
  });

  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id) {
      return ApiResponse.error(res, 'Order ID is required', 400);
    }
    
    const order = await this.orderService.updateOrderStatus(Number(id), status);
    
    return ApiResponse.success(res, order, 'Order status updated successfully');
  });

  deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      return ApiResponse.error(res, 'Order ID is required', 400);
    }
    
    await this.orderService.deleteOrder(Number(id));
    
    return ApiResponse.success(res, null, 'Order deleted successfully');
  });
}
