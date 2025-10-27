import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
// Uncomment when authentication is implemented
// router.use(authenticate);

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Admin only routes
// router.post('/', authenticate, authorize('admin'), productController.createProduct);
// router.put('/:id', authenticate, authorize('admin'), productController.updateProduct);
// router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

export default router;
