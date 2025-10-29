import { Request, Response } from 'express';
import { BannerService } from '../services/bannerService';
import { asyncHandler } from '../middlewares/errorHandler';
import type { CreateBannerDTO, UpdateBannerDTO } from '../types/banner';

const bannerService = new BannerService();

export const bannerController = {
  getAllBanners: asyncHandler(async (req: Request, res: Response) => {
    const { active } = req.query;
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    
    const banners = await bannerService.getAllBanners(isActive);
    
    res.json({
      status: 'success',
      data: banners,
    });
  }),

  getBannerById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id!);
    
    const banner = await bannerService.getBannerById(id);
    
    res.json({
      status: 'success',
      data: banner,
    });
  }),

  createBanner: asyncHandler(async (req: Request, res: Response) => {
    const bannerData: CreateBannerDTO = req.body;
    
    if (!bannerData.Title || !bannerData.Image) {
      res.status(400).json({
        status: 'error',
        message: 'Title and Image are required',
      });
      return;
    }
    
    const banner = await bannerService.createBanner(bannerData);
    
    res.status(201).json({
      status: 'success',
      data: banner,
    });
  }),

  updateBanner: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id!);
    const bannerData: UpdateBannerDTO = req.body;
    
    const banner = await bannerService.updateBanner(id, bannerData);
    
    res.json({
      status: 'success',
      data: banner,
    });
  }),

  deleteBanner: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id!);
    
    const result = await bannerService.deleteBanner(id);
    
    res.json({
      status: 'success',
      message: result.message,
    });
  }),

  toggleBannerStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id!);
    
    const banner = await bannerService.toggleBannerStatus(id);
    
    res.json({
      status: 'success',
      data: banner,
    });
  }),
};
