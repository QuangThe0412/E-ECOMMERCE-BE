const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'E-Commerce API',
    description: 'API documentation - Auto-generated from routes',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  basePath: '/',
  consumes: ['application/json'],
  produces: ['application/json'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Banner: {
        type: 'object',
        properties: {
          Id: { type: 'integer', example: 1 },
          Title: { type: 'string', example: 'Banner Title' },
          Subtitle: { type: 'string', example: 'Subtitle' },
          Description: { type: 'string', example: 'Description' },
          Image: { type: 'string', example: 'https://example.com/image.jpg' },
          ButtonText: { type: 'string', example: 'Click here' },
          ButtonLink: { type: 'string', example: '/products' },
          BackgroundColor: { type: 'string', example: 'from-blue-500 to-purple-600' },
          IsActive: { type: 'boolean', example: true },
          DisplayOrder: { type: 'integer', example: 1 },
          CreatedAt: { type: 'string', format: 'date-time' },
          UpdatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          Id: { type: 'integer', example: 1 },
          Name: { type: 'string', example: 'Product Name' },
          Description: { type: 'string', example: 'Product description' },
          Image: { type: 'string', example: 'https://example.com/image.jpg' },
          Category: { type: 'string', example: 'Áo' },
          Price: { type: 'number', example: 299000 },
          OriginalPrice: { type: 'number', example: 399000 },
          Stock: { type: 'integer', example: 100 },
          Rating: { type: 'number', example: 4.5 },
          Reviews: { type: 'integer', example: 50 }
        }
      },
      User: {
        type: 'object',
        properties: {
          Id: { type: 'string', format: 'uuid' },
          Username: { type: 'string', example: 'user123' },
          Email: { type: 'string', example: 'user@example.com' },
          Phone: { type: 'string', example: '0901234567' },
          Name: { type: 'string', example: 'Nguyen Van A' },
          Address: { type: 'string', example: '123 Street, City' },
          Role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          IsActive: { type: 'boolean', example: true }
        }
      },
      Order: {
        type: 'object',
        properties: {
          Id: { type: 'integer', example: 1 },
          UserId: { type: 'string', format: 'uuid' },
          Total: { type: 'number', example: 599000 },
          Status: { type: 'string', enum: ['pending', 'processing', 'completed', 'cancelled'], example: 'pending' },
          PaymentMethod: { type: 'string', example: 'COD' },
          Notes: { type: 'string', example: 'Giao hàng buổi sáng' },
          CreatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management' },
    { name: 'Products', description: 'Product management' },
    { name: 'Orders', description: 'Order management' },
    { name: 'Banners', description: 'Banner management' }
  ]
};

const outputFile = './src/config/swagger-output.json';
const routes = ['./src/server.ts'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  console.log('📄 File: src/config/swagger-output.json');
});
