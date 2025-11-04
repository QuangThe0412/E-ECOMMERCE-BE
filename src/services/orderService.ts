import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { Order } from '../types/order';

export class OrderService {
  async getAllOrders(page: number, limit: number, status?: string) {
    try {
      const offset = (page - 1) * limit;

      const whereClause = status ? { Status: status } : {};

      const [orders, total] = await Promise.all([
        (prisma as any).orders.findMany({
          where: whereClause,
          orderBy: { CreatedAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            OrderItems: {
              include: {
                Products: {
                  select: {
                    Id: true,
                    Name: true,
                    Price: true,
                    Image: true,
                    SubCategory: {
                      select: {
                        Id: true,
                        Name: true,
                        Category: {
                          select: {
                            Id: true,
                            Name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        (prisma as any).orders.count({ where: whereClause }),
      ]);

      return {
        data: orders,
        total,
      };
    } catch (error) {
      logger.error('OrderService.getAllOrders error:', error);
      throw new AppError('Error fetching orders', 500);
    }
  }

  async getOrderById(id: number) {
    try {
      logger.info(`Fetching order with ID: ${id}`);
      
      const order = await (prisma as any).orders.findUnique({
        where: { Id: id },
        include: {
          OrderItems: {
            include: {
              Products: {
                select: {
                  Id: true,
                  Name: true,
                  Price: true,
                  Image: true,
                  Description: true,
                  Stock: true,
                  SubCategoryId: true,
                  SubCategory: {
                    select: {
                      Id: true,
                      Name: true,
                      CategoryId: true,
                      Category: {
                        select: {
                          Id: true,
                          Name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!order) {
        logger.warn(`Order not found: ${id}`);
        throw new AppError('Order not found', 404);
      }

      logger.info(`Order found: ${order.Id}`);
      return order;
    } catch (error) {
      logger.error('OrderService.getOrderById error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching order', 500);
    }
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    try {
      logger.info(`Fetching orders for user: ${userId}`);
      const offset = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        (prisma as any).orders.findMany({
          where: { UserId: userId },
          orderBy: { CreatedAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            OrderItems: {
              include: {
                Products: {
                  select: {
                    Id: true,
                    Name: true,
                    Price: true,
                    Image: true,
                    Description: true,
                    Stock: true,
                    SubCategoryId: true,
                    SubCategory: {
                      select: {
                        Id: true,
                        Name: true,
                        CategoryId: true,
                        Category: {
                          select: {
                            Id: true,
                            Name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        (prisma as any).orders.count({ where: { UserId: userId } }),
      ]);

      logger.info(`Found ${orders.length} orders for user ${userId}`);
      return {
        data: orders,
        total,
      };
    } catch (error) {
      logger.error('OrderService.getUserOrders error:', error);
      throw new AppError('Error fetching user orders', 500);
    }
  }

  async createOrder(orderData: Partial<Order> & { Items?: { ProductId: number; Quantity: number; Price: number }[] }) {
    try {
      logger.info('Creating order with data:', JSON.stringify(orderData));
      
      // Validate required fields
      if (!orderData.UserId) {
        logger.error('Missing UserId in order data');
        throw new AppError('UserId is required', 400);
      }
      
      if (!orderData.Total || orderData.Total <= 0) {
        logger.error('Missing or invalid Total in order data');
        throw new AppError('Valid Total is required', 400);
      }

      // Create order
      const order = await (prisma as any).orders.create({
        data: {
          UserId: orderData.UserId,
          Total: orderData.Total,
          Status: orderData.Status || 'pending',
          PaymentMethod: orderData.PaymentMethod || null,
          Notes: orderData.Notes || null,
        },
      });

      logger.info('Order created successfully:', order.Id);

      // Create order items if provided
      if (orderData.Items && orderData.Items.length > 0) {
        logger.info(`Creating ${orderData.Items.length} order items`);
        
        await (prisma as any).orderItems.createMany({
          data: orderData.Items.map(item => ({
            OrderId: order.Id,
            ProductId: item.ProductId,
            Quantity: item.Quantity,
            Price: item.Price,
          })),
        });

        logger.info('Order items created successfully');
      }

      // Return order with items and full product info including category hierarchy
      const orderWithItems = await (prisma as any).orders.findUnique({
        where: { Id: order.Id },
        include: {
          OrderItems: {
            include: {
              Products: {
                select: {
                  Id: true,
                  Name: true,
                  Price: true,
                  Image: true,
                  Description: true,
                  Stock: true,
                  SubCategoryId: true,
                  SubCategory: {
                    select: {
                      Id: true,
                      Name: true,
                      CategoryId: true,
                      Category: {
                        select: {
                          Id: true,
                          Name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return orderWithItems;
    } catch (error) {
      logger.error('OrderService.createOrder error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating order', 500);
    }
  }

  async updateOrderStatus(id: number, status: string) {
    try {
      // Validate status
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!status || !validStatuses.includes(status.toLowerCase())) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      // Check if order exists
      const order = await (prisma as any).orders.findUnique({
        where: { Id: id },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Update order status
      const updatedOrder = await (prisma as any).orders.update({
        where: { Id: id },
        data: {
          Status: status.toLowerCase(),
        },
        include: {
          OrderItems: {
            include: {
              Products: {
                select: {
                  Id: true,
                  Name: true,
                  Price: true,
                  Image: true,
                  SubCategoryId: true,
                  SubCategory: {
                    select: {
                      Id: true,
                      Name: true,
                      CategoryId: true,
                      Category: {
                        select: {
                          Id: true,
                          Name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      logger.info(`Order ${id} status updated to: ${status}`);
      return updatedOrder;
    } catch (error) {
      logger.error('OrderService.updateOrderStatus error:', error);
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
      logger.error('OrderService.deleteOrder error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting order', 500);
    }
  }
}
