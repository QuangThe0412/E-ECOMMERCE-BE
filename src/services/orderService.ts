import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { Order } from '../types/order';

export class OrderService {
  async getAllOrders(page: number, limit: number, status?: string) {
    try {
      const offset = (page - 1) * limit;

      const whereClause = status ? { Status: status } : {};

      const [orders, total] = await Promise.all([
        prisma.orders.findMany({
          where: whereClause,
          orderBy: { CreatedAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        prisma.orders.count({ where: whereClause }),
      ]);

      return {
        data: orders,
        total,
      };
    } catch (error) {
      throw new AppError('Error fetching orders', 500);
    }
  }

  async getOrderById(id: number) {
    try {
      const order = await prisma.orders.findUnique({
        where: { Id: id },
        include: {
          OrderItems: true,
        },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching order', 500);
    }
  }

  async createOrder(orderData: Partial<Order>) {
    try {
      const order = await prisma.orders.create({
        data: {
          UserId: orderData.UserId!,
          Total: orderData.Total!,
          Status: 'pending',
          CreatedAt: new Date(),
          PaymentMethod: orderData.PaymentMethod || null,
          Notes: orderData.Notes || null,
        },
      });

      return order;
    } catch (error) {
      throw new AppError('Error creating order', 500);
    }
  }

  async updateOrderStatus(id: number, status: string) {
    try {
      const order = await prisma.orders.update({
        where: { Id: id },
        data: {
          Status: status,
        },
      });

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating order status', 500);
    }
  }

  async deleteOrder(id: number) {
    try {
      // Check if order has order items
      const itemsCount = await prisma.orderItems.count({
        where: { OrderId: id },
      });

      if (itemsCount > 0) {
        throw new AppError('Cannot delete order with existing items', 400);
      }

      await prisma.orders.delete({
        where: { Id: id },
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting order', 500);
    }
  }
}
