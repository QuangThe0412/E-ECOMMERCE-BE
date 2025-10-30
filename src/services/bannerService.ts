import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { Banner, CreateBannerDTO, UpdateBannerDTO } from '../types/banner';

export class BannerService {
  async getAllBanners(isActive?: boolean) {
    try {
      const whereClause = isActive !== undefined ? { IsActive: isActive } : {};

      const banners = await prisma.banners.findMany({
        where: whereClause,
        orderBy: { DisplayOrder: 'asc' },
      });

      return banners as unknown as Banner[];
    } catch (error) {
      console.error('BannerService.getAllBanners error:', error);
      throw new AppError('Error fetching banners', 500);
    }
  }

  async getBannerById(id: number) {
    try {
      const banner = await prisma.banners.findUnique({
        where: { Id: id },
      });

      if (!banner) {
        throw new AppError('Banner not found', 404);
      }

      return banner as unknown as Banner;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('BannerService.getBannerById error:', error);
      throw new AppError('Error fetching banner', 500);
    }
  }

  async createBanner(bannerData: CreateBannerDTO) {
    try {
      const banner = await prisma.banners.create({
        data: {
          Title: bannerData.Title,
          Subtitle: bannerData.Subtitle || null,
          Description: bannerData.Description || null,
          Image: bannerData.Image,
          ButtonText: bannerData.ButtonText || null,
          ButtonLink: bannerData.ButtonLink || null,
          BackgroundColor: bannerData.BackgroundColor || null,
          DisplayOrder: bannerData.DisplayOrder || 0,
          IsActive: true,
          CreatedAt: new Date(),
          UpdatedAt: new Date(),
        },
      });

      return banner as unknown as Banner;
    } catch (error) {
      console.error('BannerService.createBanner error:', error);
      throw new AppError('Error creating banner', 500);
    }
  }

  async updateBanner(id: number, bannerData: UpdateBannerDTO) {
    try {
      const existingBanner = await prisma.banners.findUnique({
        where: { Id: id },
      });

      if (!existingBanner) {
        throw new AppError('Banner not found', 404);
      }

      const banner = await prisma.banners.update({
        where: { Id: id },
        data: {
          ...(bannerData.Title && { Title: bannerData.Title }),
          ...(bannerData.Subtitle !== undefined && { Subtitle: bannerData.Subtitle }),
          ...(bannerData.Description !== undefined && { Description: bannerData.Description }),
          ...(bannerData.Image && { Image: bannerData.Image }),
          ...(bannerData.ButtonText !== undefined && { ButtonText: bannerData.ButtonText }),
          ...(bannerData.ButtonLink !== undefined && { ButtonLink: bannerData.ButtonLink }),
          ...(bannerData.BackgroundColor !== undefined && { BackgroundColor: bannerData.BackgroundColor }),
          ...(bannerData.IsActive !== undefined && { IsActive: bannerData.IsActive }),
          ...(bannerData.DisplayOrder !== undefined && { DisplayOrder: bannerData.DisplayOrder }),
          UpdatedAt: new Date(),
        },
      });

      return banner as unknown as Banner;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('BannerService.updateBanner error:', error);
      throw new AppError('Error updating banner', 500);
    }
  }

  async deleteBanner(id: number) {
    try {
      const existingBanner = await prisma.banners.findUnique({
        where: { Id: id },
      });

      if (!existingBanner) {
        throw new AppError('Banner not found', 404);
      }

      await prisma.banners.delete({
        where: { Id: id },
      });

      return { message: 'Banner deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('BannerService.deleteBanner error:', error);
      throw new AppError('Error deleting banner', 500);
    }
  }

  async toggleBannerStatus(id: number) {
    try {
      const existingBanner = await prisma.banners.findUnique({
        where: { Id: id },
      });

      if (!existingBanner) {
        throw new AppError('Banner not found', 404);
      }

      const banner = await prisma.banners.update({
        where: { Id: id },
        data: {
          IsActive: !existingBanner.IsActive,
          UpdatedAt: new Date(),
        },
      });

      return banner as unknown as Banner;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('BannerService.toggleBannerStatus error:', error);
      throw new AppError('Error toggling banner status', 500);
    }
  }
}
