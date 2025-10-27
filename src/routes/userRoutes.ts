import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

// Public routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Protected routes (require authentication)
// Uncomment when authentication is implemented
// router.use(authenticate);

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Admin only routes
// router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

export default router;
