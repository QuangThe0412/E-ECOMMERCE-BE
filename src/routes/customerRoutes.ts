import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
// import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();
const customerController = new CustomerController();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management API
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name, email, or phone
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/', customerController.getAllCustomers);

/**
 * @swagger
 * /api/customers/by-email:
 *   get:
 *     summary: Get customer by email
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer email
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: Customer not found
 */
router.get('/by-email', customerController.getCustomerByEmail);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Customer retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 */
router.get('/:id', customerController.getCustomerById);

/**
 * @swagger
 * /api/customers/{id}/orders:
 *   get:
 *     summary: Get customer orders
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Customer orders retrieved successfully
 */
router.get('/:id/orders', customerController.getCustomerOrders);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - Email
 *             properties:
 *               Name:
 *                 type: string
 *                 example: Nguyen Van A
 *               Email:
 *                 type: string
 *                 example: nguyenvana@example.com
 *               Phone:
 *                 type: string
 *                 example: "0901234567"
 *               Address:
 *                 type: string
 *                 example: 123 Nguyen Hue, HCM
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Invalid input or email already exists
 */
router.post('/', customerController.createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Email:
 *                 type: string
 *               Phone:
 *                 type: string
 *               Address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 */
router.put('/:id', customerController.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Cannot delete customer with existing orders
 *       404:
 *         description: Customer not found
 */
router.delete('/:id', customerController.deleteCustomer);

export default router;
