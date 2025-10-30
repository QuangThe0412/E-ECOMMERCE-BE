import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import type { AddToCartDTO, UpdateCartItemDTO, CartWithItems } from '../types/cart';

export class CartService {
  /**
   * Get or create cart for user
   */
  async getOrCreateCart(userId: string) {
    try {
      let cart = await prisma.carts.findUnique({
        where: { UserId: userId },
      });

      if (!cart) {
        cart = await prisma.carts.create({
          data: {
            UserId: userId,
          },
        });
      }

      return cart;
    } catch (error) {
      logger.error('CartService.getOrCreateCart error:', error);
      throw new AppError('Error getting or creating cart', 500);
    }
  }

  /**
   * Get user's cart with items
   */
  async getCart(userId: string): Promise<CartWithItems> {
    try {
      const cart = await this.getOrCreateCart(userId);

      const cartWithItems = await prisma.carts.findUnique({
        where: { Id: cart.Id },
        include: {
          CartItems: {
            include: {
              Products: true,
            },
            orderBy: {
              CreatedAt: 'desc',
            },
          },
        },
      });

      if (!cartWithItems) {
        throw new AppError('Cart not found', 404);
      }

      // Calculate total and item count
      const total = cartWithItems.CartItems.reduce((sum: number, item: any) => {
        return sum + Number(item.Products.Price) * item.Quantity;
      }, 0);

      const itemCount = cartWithItems.CartItems.reduce((sum: number, item: any) => {
        return sum + item.Quantity;
      }, 0);

      return {
        ...cartWithItems,
        total,
        itemCount,
      } as any;
    } catch (error) {
      logger.error('CartService.getCart error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching cart', 500);
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: string, data: AddToCartDTO) {
    try {
      // Check if product exists and has stock
      const product = await prisma.products.findUnique({
        where: { Id: data.ProductId },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      if (product.Stock < data.Quantity) {
        throw new AppError('Insufficient stock', 400);
      }

      // Get or create cart
      const cart = await this.getOrCreateCart(userId);

      // Check if item already exists in cart
      const existingItem = await prisma.cartItems.findUnique({
        where: {
          CartId_ProductId: {
            CartId: cart.Id,
            ProductId: data.ProductId,
          },
        },
      });

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.Quantity + data.Quantity;

        if (product.Stock < newQuantity) {
          throw new AppError('Insufficient stock', 400);
        }

        const updatedItem = await prisma.cartItems.update({
          where: { Id: existingItem.Id },
          data: { Quantity: newQuantity },
          include: {
            Products: true,
          },
        });

        return updatedItem;
      } else {
        // Create new cart item
        const newItem = await prisma.cartItems.create({
          data: {
            CartId: cart.Id,
            ProductId: data.ProductId,
            Quantity: data.Quantity,
          },
          include: {
            Products: true,
          },
        });

        return newItem;
      }
    } catch (error) {
      logger.error('CartService.addToCart error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error adding item to cart', 500);
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId: string, itemId: number, data: UpdateCartItemDTO) {
    try {
      // Find cart item and verify ownership
      const cartItem = await prisma.cartItems.findUnique({
        where: { Id: itemId },
        include: {
          Carts: true,
          Products: true,
        },
      });

      if (!cartItem) {
        throw new AppError('Cart item not found', 404);
      }

      if (cartItem.Carts.UserId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Check stock
      if (cartItem.Products.Stock < data.Quantity) {
        throw new AppError('Insufficient stock', 400);
      }

      // Update quantity
      const updatedItem = await prisma.cartItems.update({
        where: { Id: itemId },
        data: { Quantity: data.Quantity },
        include: {
          Products: true,
        },
      });

      return updatedItem;
    } catch (error) {
      logger.error('CartService.updateCartItem error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating cart item', 500);
    }
  }

  /**
   * Remove item from cart
   */
  async removeCartItem(userId: string, itemId: number) {
    try {
      // Find cart item and verify ownership
      const cartItem = await prisma.cartItems.findUnique({
        where: { Id: itemId },
        include: {
          Carts: true,
        },
      });

      if (!cartItem) {
        throw new AppError('Cart item not found', 404);
      }

      if (cartItem.Carts.UserId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Delete cart item
      await prisma.cartItems.delete({
        where: { Id: itemId },
      });

      return { message: 'Item removed from cart' };
    } catch (error) {
      logger.error('CartService.removeCartItem error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error removing cart item', 500);
    }
  }

  /**
   * Clear cart
   */
  async clearCart(userId: string) {
    try {
      const cart = await this.getOrCreateCart(userId);

      await prisma.cartItems.deleteMany({
        where: { CartId: cart.Id },
      });

      return { message: 'Cart cleared successfully' };
    } catch (error) {
      logger.error('CartService.clearCart error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error clearing cart', 500);
    }
  }
}
