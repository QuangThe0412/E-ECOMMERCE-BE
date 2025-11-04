import { Router } from 'express';
import { subCategoryController } from '../controllers/subCategoryController';

const router = Router();

/**
 * @swagger
 * /api/subcategories:
 *   get:
 *     summary: Get all subcategories with optional category filter
 *     tags: [SubCategories]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubCategory'
 */
router.get('/', subCategoryController.getAllSubCategories);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: SubCategory details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       404:
 *         description: SubCategory not found
 */
router.get('/:id', subCategoryController.getSubCategoryById);

/**
 * @swagger
 * /api/subcategories:
 *   post:
 *     summary: Create new subcategory
 *     tags: [SubCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Name, CategoryId]
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Rượu"
 *               CategoryId:
 *                 type: integer
 *                 example: 1
 *               Description:
 *                 type: string
 *               Image:
 *                 type: string
 *               DisplayOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: SubCategory created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 */
router.post('/', subCategoryController.createSubCategory);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   put:
 *     summary: Update subcategory
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               Image:
 *                 type: string
 *               DisplayOrder:
 *                 type: integer
 *               IsActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: SubCategory updated
 */
router.put('/:id', subCategoryController.updateSubCategory);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   delete:
 *     summary: Delete subcategory
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: SubCategory deleted
 */
router.delete('/:id', subCategoryController.deleteSubCategory);

export default router;
