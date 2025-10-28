import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '../types/user';

export class CustomerService {
  async getAllCustomers(page: number, limit: number, search?: string) {
    try {
      const offset = (page - 1) * limit;

      const whereClause = search ? {
        OR: [
          { Name: { contains: search } },
          { Email: { contains: search } },
          { Phone: { contains: search } },
        ]
      } : {};

      const [customers, total] = await Promise.all([
        prisma.customers.findMany({
          where: whereClause,
          orderBy: { Id: 'desc' },
          skip: offset,
          take: limit,
        }),
        prisma.customers.count({ where: whereClause }),
      ]);

      return {
        data: customers as unknown as Customer[],
        total,
      };
    } catch (error) {
      console.error('CustomerService.getAllCustomers error:', error);
      throw new AppError('Error fetching customers', 500);
    }
  }

  async getCustomerById(id: number) {
    try {
      const customer = await prisma.customers.findUnique({
        where: { Id: id },
      });

      if (!customer) {
        throw new AppError('Customer not found', 404);
      }

      return customer as unknown as Customer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('CustomerService.getCustomerById error:', error);
      throw new AppError('Error fetching customer', 500);
    }
  }

  async getCustomerByEmail(email: string) {
    try {
      const customer = await prisma.customers.findFirst({
        where: { Email: email },
      });

      return customer ? (customer as unknown as Customer) : null;
    } catch (error) {
      console.error('CustomerService.getCustomerByEmail error:', error);
      throw new AppError('Error fetching customer', 500);
    }
  }

  async createCustomer(customerData: CreateCustomerDTO) {
    try {
      // Check if email already exists
      const existing = await this.getCustomerByEmail(customerData.Email);
      if (existing) {
        throw new AppError('Email already exists', 400);
      }

      const customer = await prisma.customers.create({
        data: {
          Name: customerData.Name,
          Email: customerData.Email,
          Phone: customerData.Phone || null,
          Address: customerData.Address || null,
        },
      });

      return customer as unknown as Customer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('CustomerService.createCustomer error:', error);
      throw new AppError('Error creating customer', 500);
    }
  }

  async updateCustomer(id: number, customerData: UpdateCustomerDTO) {
    try {
      // Check if customer exists
      await this.getCustomerById(id);

      // If email is being updated, check if it's already taken
      if (customerData.Email) {
        const existing = await this.getCustomerByEmail(customerData.Email);
        if (existing && existing.Id !== id) {
          throw new AppError('Email already exists', 400);
        }
      }

      // Build dynamic update data
      const updateData: any = {};
      
      if (customerData.Name !== undefined) {
        updateData.Name = customerData.Name;
      }
      if (customerData.Email !== undefined) {
        updateData.Email = customerData.Email;
      }
      if (customerData.Phone !== undefined) {
        updateData.Phone = customerData.Phone;
      }
      if (customerData.Address !== undefined) {
        updateData.Address = customerData.Address;
      }

      if (Object.keys(updateData).length === 0) {
        throw new AppError('No fields to update', 400);
      }

      const customer = await prisma.customers.update({
        where: { Id: id },
        data: updateData,
      });

      return customer as unknown as Customer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('CustomerService.updateCustomer error:', error);
      throw new AppError('Error updating customer', 500);
    }
  }

  async deleteCustomer(id: number) {
    try {
      // Check if customer exists
      await this.getCustomerById(id);

      // Check if customer has orders
      const ordersCount = await prisma.orders.count({
        where: { CustomerId: id },
      });

      if (ordersCount > 0) {
        throw new AppError('Cannot delete customer with existing orders', 400);
      }

      await prisma.customers.delete({
        where: { Id: id },
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('CustomerService.deleteCustomer error:', error);
      throw new AppError('Error deleting customer', 500);
    }
  }

  async getCustomerOrders(id: number, page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;

      // Check if customer exists
      await this.getCustomerById(id);

      const [orders, total] = await Promise.all([
        prisma.orders.findMany({
          where: { CustomerId: id },
          orderBy: { CreatedAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        prisma.orders.count({ where: { CustomerId: id } }),
      ]);

      return {
        data: orders,
        total,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('CustomerService.getCustomerOrders error:', error);
      throw new AppError('Error fetching customer orders', 500);
    }
  }
}
