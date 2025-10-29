import { Router } from 'express';
import { bannerController } from '../controllers/bannerController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management APIs
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 */
router.get('/', bannerController.getAllBanners);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner not found
 */
router.get('/:id', bannerController.getBannerById);

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Create new banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *               - Image
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "Bộ Sưu Tập Mùa Hè 2025"
 *               Subtitle:
 *                 type: string
 *                 example: "Thời trang nhẹ nhàng, thoải mái"
 *               Description:
 *                 type: string
 *                 example: "Khám phá những thiết kế mới nhất"
 *               Image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               ButtonText:
 *                 type: string
 *                 example: "Khám Phá Ngay"
 *               ButtonLink:
 *                 type: string
 *                 example: "/products"
 *               BackgroundColor:
 *                 type: string
 *                 example: "from-blue-500 to-purple-600"
 *               DisplayOrder:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('admin'), bannerController.createBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Update banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Subtitle:
 *                 type: string
 *               Description:
 *                 type: string
 *               Image:
 *                 type: string
 *               ButtonText:
 *                 type: string
 *               ButtonLink:
 *                 type: string
 *               BackgroundColor:
 *                 type: string
 *               IsActive:
 *                 type: boolean
 *               DisplayOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, authorize('admin'), bannerController.updateBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Delete banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, authorize('admin'), bannerController.deleteBanner);

/**
 * @swagger
 * /api/banners/{id}/toggle:
 *   patch:
 *     summary: Toggle banner active status
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner status toggled successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/toggle', authenticate, authorize('admin'), bannerController.toggleBannerStatus);

export default router;
