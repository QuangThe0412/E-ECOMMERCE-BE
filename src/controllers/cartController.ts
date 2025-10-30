import type { Response } from 'express';
import { CartService } from '../services/cartService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import type { AuthRequest } from '../middlewares/authMiddleware';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  /**
   * Get user's cart
   */
  getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const cart = await this.cartService.getCart(userId);

    return ApiResponse.success(res, cart, 'Cart retrieved successfully');
  });

  /**
   * Add item to cart
   */
  addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const { ProductId, Quantity } = req.body;

    if (!ProductId || !Quantity) {
      return ApiResponse.error(res, 'ProductId and Quantity are required', 400);
    }

    if (Quantity < 1) {
      return ApiResponse.error(res, 'Quantity must be at least 1', 400);
    }

    const cartItem = await this.cartService.addToCart(userId, {
      ProductId: parseInt(ProductId),
      Quantity: parseInt(Quantity),
    });

    return ApiResponse.success(res, cartItem, 'Item added to cart successfully', 201);
  });

  /**
   * Update cart item quantity
   */
  updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const itemId = parseInt(req.params.itemId || '0');
    const { Quantity } = req.body;

    if (!Quantity) {
      return ApiResponse.error(res, 'Quantity is required', 400);
    }

    if (Quantity < 1) {
      return ApiResponse.error(res, 'Quantity must be at least 1', 400);
    }

    const cartItem = await this.cartService.updateCartItem(userId, itemId, {
      Quantity: parseInt(Quantity),
    });

    return ApiResponse.success(res, cartItem, 'Cart item updated successfully');
  });

  /**
   * Remove item from cart
   */
  removeCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const itemId = parseInt(req.params.itemId || '0');

    const result = await this.cartService.removeCartItem(userId, itemId);

    return ApiResponse.success(res, null, result.message);
  });

  /**
   * Clear cart
   */
  clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const result = await this.cartService.clearCart(userId);

    return ApiResponse.success(res, null, result.message);
  });
}
