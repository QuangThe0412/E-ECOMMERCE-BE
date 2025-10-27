import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();
const orderController = new OrderController();

// Protected routes (require authentication)
// Uncomment when authentication is implemented
// router.use(authenticate);

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

export default router;
