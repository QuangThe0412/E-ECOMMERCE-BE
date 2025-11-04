import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import swaggerSpec from './config/swagger';

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import subCategoryRoutes from './routes/subCategoryRoutes';
import orderRoutes from './routes/orderRoutes';
import bannerRoutes from './routes/bannerRoutes';
import cartRoutes from './routes/cartRoutes';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env';
dotenv.config({ path: envFile });
logger.info(`Loading environment from: ${envFile}`);

const app: Application = express();
const PORT = process.env.PORT || 3000;
const CORS_URL = process.env.CORS_URL || 'http://localhost:8080';

// CORS configuration
app.use(cors({
  origin: CORS_URL,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation - Only in development
if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'E-Commerce API Documentation',
  }));

  // Swagger JSON endpoint
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  logger.info('Swagger documentation enabled at /api-docs');
} else {
  // Disable Swagger in production
  app.use('/api-docs', (_req, res) => {
    res.status(403).json({ message: 'Swagger is disabled in production' });
  });
}

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/cart', cartRoutes);

// Error handler middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Prisma handles database connections automatically
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'production'}`);
      
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
        console.log(`📄 Swagger JSON: http://localhost:${PORT}/api-docs.json`);
      }
      console.log();
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
