import swaggerJsdoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Documentation',
      version: '1.0.0',
      description: 'API documentation for E-Commerce Backend with Express, TypeScript and SQL Server',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.ecommerce.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          required: ['Name', 'Email'],
          properties: {
            Id: {
              type: 'integer',
              description: 'Customer ID',
              example: 1,
            },
            Name: {
              type: 'string',
              description: 'Customer full name',
              example: 'Nguyen Van A',
            },
            Email: {
              type: 'string',
              format: 'email',
              description: 'Customer email address',
              example: 'nguyenvana@example.com',
            },
            Phone: {
              type: 'string',
              description: 'Customer phone number',
              example: '0901234567',
            },
            Address: {
              type: 'string',
              description: 'Customer address',
              example: '123 Nguyen Hue, HCM',
            },
          },
        },
        User: {
          type: 'object',
          required: ['email', 'name', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: 'user-001',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password (hashed)',
              example: '123456',
            },
            role: {
              type: 'string',
              description: 'User role',
              enum: ['user', 'admin'],
              example: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update date',
            },
          },
        },
        Product: {
          type: 'object',
          required: ['Name', 'Price', 'Stock'],
          properties: {
            Id: {
              type: 'integer',
              description: 'Product ID',
              example: 1,
            },
            Name: {
              type: 'string',
              description: 'Product name',
              example: 'iPhone 14 Pro Max',
            },
            Description: {
              type: 'string',
              description: 'Product description',
              example: 'Latest iPhone with A16 Bionic chip',
            },
            Image: {
              type: 'string',
              description: 'Product image URL',
              example: 'https://example.com/iphone.jpg',
            },
            Category: {
              type: 'string',
              description: 'Product category',
              example: 'Điện thoại',
            },
            Price: {
              type: 'number',
              format: 'decimal',
              description: 'Current product price',
              example: 29990000,
            },
            OriginalPrice: {
              type: 'number',
              format: 'decimal',
              description: 'Original product price',
              example: 33990000,
            },
            Stock: {
              type: 'integer',
              description: 'Available stock quantity',
              example: 50,
            },
            Rating: {
              type: 'number',
              format: 'float',
              description: 'Product rating (0-5)',
              example: 4.5,
            },
            Reviews: {
              type: 'integer',
              description: 'Number of reviews',
              example: 128,
            },
            Colors: {
              type: 'string',
              description: 'Available colors (comma-separated)',
              example: 'Deep Purple,Gold,Silver,Space Black',
            },
            Sizes: {
              type: 'string',
              description: 'Available sizes (comma-separated)',
              example: '128GB,256GB,512GB,1TB',
            },
          },
        },
        Order: {
          type: 'object',
          required: ['CustomerId', 'Total'],
          properties: {
            Id: {
              type: 'integer',
              description: 'Order ID',
              example: 1,
            },
            CustomerId: {
              type: 'integer',
              description: 'Customer ID who placed the order',
              example: 1,
            },
            CreatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date',
              example: '2024-01-15T10:30:00Z',
            },
            Total: {
              type: 'number',
              format: 'decimal',
              description: 'Total order amount',
              example: 59980000,
            },
            Status: {
              type: 'string',
              description: 'Order status',
              enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
              example: 'Pending',
            },
            PaymentMethod: {
              type: 'string',
              description: 'Payment method',
              example: 'COD',
            },
            Notes: {
              type: 'string',
              description: 'Order notes',
              example: 'Giao hàng giờ hành chính',
            },
          },
        },
        OrderItem: {
          type: 'object',
          required: ['OrderId', 'ProductId', 'Quantity', 'Price'],
          properties: {
            Id: {
              type: 'integer',
              description: 'Order item ID',
              example: 1,
            },
            OrderId: {
              type: 'integer',
              description: 'Order ID',
              example: 1,
            },
            ProductId: {
              type: 'integer',
              description: 'Product ID',
              example: 1,
            },
            Quantity: {
              type: 'integer',
              description: 'Product quantity',
              example: 2,
            },
            Price: {
              type: 'number',
              format: 'decimal',
              description: 'Product price at time of order',
              example: 29990000,
            },
          },
        },
        Banner: {
          type: 'object',
          required: ['Title', 'Image'],
          properties: {
            Id: {
              type: 'integer',
              description: 'Banner ID',
              example: 1,
            },
            Title: {
              type: 'string',
              description: 'Banner title',
              example: 'Bộ Sưu Tập Mùa Hè 2025',
            },
            Subtitle: {
              type: 'string',
              description: 'Banner subtitle',
              example: 'Thời trang nhẹ nhàng, thoải mái cho mùa hè sôi động',
            },
            Description: {
              type: 'string',
              description: 'Banner description',
              example: 'Khám phá những thiết kế mới nhất với chất liệu thoáng mát',
            },
            Image: {
              type: 'string',
              description: 'Banner image URL',
              example: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
            },
            ButtonText: {
              type: 'string',
              description: 'Button text',
              example: 'Khám Phá Ngay',
            },
            ButtonLink: {
              type: 'string',
              description: 'Button link URL',
              example: '/products?category=Áo',
            },
            BackgroundColor: {
              type: 'string',
              description: 'Background gradient color classes',
              example: 'from-blue-500 to-purple-600',
            },
            IsActive: {
              type: 'boolean',
              description: 'Banner active status',
              example: true,
            },
            DisplayOrder: {
              type: 'integer',
              description: 'Display order (lower numbers show first)',
              example: 1,
            },
            CreatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Banner creation date',
            },
            UpdatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Banner last update date',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'Data retrieved successfully',
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  example: 100,
                },
                totalPages: {
                  type: 'integer',
                  example: 10,
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
