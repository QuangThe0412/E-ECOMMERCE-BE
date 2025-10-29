import { Router } from 'express';
import { bannerController } from '../controllers/bannerController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// #swagger.tags = ['Banners']
router.get('/', bannerController.getAllBanners);
  /* #swagger.description = 'Get all banners (or filter by active status)'
     #swagger.parameters['active'] = {
        in: 'query',
        description: 'Filter by active status (true/false)',
        required: false,
        type: 'boolean'
     }
     #swagger.responses[200] = {
        description: 'List of banners',
        schema: { $ref: '#/components/schemas/Banner' }
     }
  */

// #swagger.tags = ['Banners']
router.get('/:id', bannerController.getBannerById);
  /* #swagger.description = 'Get banner by ID'
     #swagger.parameters['id'] = { description: 'Banner ID' }
     #swagger.responses[200] = { description: 'Banner details' }
     #swagger.responses[404] = { description: 'Banner not found' }
  */

// #swagger.tags = ['Banners']
// #swagger.security = [{ "bearerAuth": [] }]
router.post('/', authenticate, authorize('admin'), bannerController.createBanner);
  /* #swagger.description = 'Create new banner (Admin only)'
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              required: ['Title', 'Image'],
              properties: {
                Title: { type: 'string', example: 'Bộ Sưu Tập Mùa Hè 2025' },
                Subtitle: { type: 'string', example: 'Thời trang nhẹ nhàng' },
                Description: { type: 'string', example: 'Khám phá thiết kế mới' },
                Image: { type: 'string', example: 'https://example.com/image.jpg' },
                ButtonText: { type: 'string', example: 'Khám Phá Ngay' },
                ButtonLink: { type: 'string', example: '/products' },
                BackgroundColor: { type: 'string', example: 'from-blue-500 to-purple-600' },
                DisplayOrder: { type: 'integer', example: 1 }
              }
            }
          }
        }
     }
     #swagger.responses[201] = { description: 'Banner created successfully' }
     #swagger.responses[400] = { description: 'Validation error' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */

// #swagger.tags = ['Banners']
// #swagger.security = [{ "bearerAuth": [] }]
router.put('/:id', authenticate, authorize('admin'), bannerController.updateBanner);
  /* #swagger.description = 'Update banner (Admin only)'
     #swagger.parameters['id'] = { description: 'Banner ID' }
     #swagger.responses[200] = { description: 'Banner updated' }
     #swagger.responses[404] = { description: 'Banner not found' }
  */

// #swagger.tags = ['Banners']
// #swagger.security = [{ "bearerAuth": [] }]
router.delete('/:id', authenticate, authorize('admin'), bannerController.deleteBanner);
  /* #swagger.description = 'Delete banner (Admin only)'
     #swagger.parameters['id'] = { description: 'Banner ID' }
     #swagger.responses[200] = { description: 'Banner deleted' }
     #swagger.responses[404] = { description: 'Banner not found' }
  */

// #swagger.tags = ['Banners']
// #swagger.security = [{ "bearerAuth": [] }]
router.patch('/:id/toggle', authenticate, authorize('admin'), bannerController.toggleBannerStatus);
  /* #swagger.description = 'Toggle banner active status (Admin only)'
     #swagger.parameters['id'] = { description: 'Banner ID' }
     #swagger.responses[200] = { description: 'Status toggled successfully' }
  */

export default router;
