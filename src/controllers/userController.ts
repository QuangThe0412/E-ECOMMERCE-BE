import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await this.userService.getAllUsers(
      Number(page),
      Number(limit)
    );
    
    return ApiResponse.paginated(
      res,
      result.data,
      Number(page),
      Number(limit),
      result.total,
      'Users retrieved successfully'
    );
  });

  getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    
    return ApiResponse.success(res, user, 'User retrieved successfully');
  });

  createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const user = await this.userService.createUser(userData);
    
    return ApiResponse.success(res, user, 'User created successfully', 201);
  });

  updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userData = req.body;
    const user = await this.userService.updateUser(id, userData);
    
    return ApiResponse.success(res, user, 'User updated successfully');
  });

  deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await this.userService.deleteUser(id);
    
    return ApiResponse.success(res, null, 'User deleted successfully');
  });
}
