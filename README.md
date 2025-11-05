## ▶️ Chạy Server

### Development (Hot Reload)

```bash
npm run dev
```

- Server: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Auto-reload khi file thay đổi
- Database: `.env.dev`

### Production

```bash
# Build
npm run build

# Start
npm start
```

- Database: `.env`
- Swagger: bị disable

---

## 💾 Quản lý Database

### Prisma Commands

#### ⭐ PHẢI chạy sau khi sửa `prisma/schema.prisma`

```bash
npx prisma generate
```

Sinh Prisma client từ schema mới.

#### Sync Database

**Development**:
```bash
npx prisma db push
```

**Production** (Safe):
```bash
npx prisma migrate dev --name "describe_change"
npx prisma migrate deploy
```

#### View Database GUI

```bash
npx prisma studio
```

Mở `http://localhost:5555` để view/edit data.

---

## 🆕 Thêm Feature Mới - Step by Step

### Step 1: Thêm Model vào Schema

Edit `prisma/schema.prisma`:

```typescript
model MyModel {
  Id          Int         @id @default(autoincrement())
  Name        String      @db.NVarChar(255)
  Description String?     @db.NVarChar(Max)
  CreatedAt   DateTime    @default(now()) @db.DateTime
  UpdatedAt   DateTime    @default(now()) @updatedAt @db.DateTime
  
  @@index([Name])
}
```

### Step 2: Sinh Client & Sync DB

```bash
npx prisma generate
npx prisma db push
```

### Step 3: Tạo TypeScript Types

File: `src/types/myModel.ts`

```typescript
export interface MyModel {
  Id: number;
  Name: string;
  Description?: string | null;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateMyModelDTO {
  Name: string;
  Description?: string;
}

export interface UpdateMyModelDTO {
  Name?: string;
  Description?: string;
}
```

### Step 4: Tạo Service

File: `src/services/myModelService.ts`

```typescript
import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

export class MyModelService {
  async getAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [data, total] = await Promise.all([
        (prisma as any).myModel.findMany({
          skip: offset,
          take: limit,
          orderBy: { CreatedAt: 'desc' }
        }),
        (prisma as any).myModel.count()
      ]);
      return { data, total };
    } catch (error) {
      logger.error('Error:', error);
      throw new AppError('Error fetching', 500);
    }
  }

  async getById(id: number) {
    try {
      const data = await (prisma as any).myModel.findUnique({
        where: { Id: id }
      });
      if (!data) throw new AppError('Not found', 404);
      return data;
    } catch (error) {
      logger.error('Error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching', 500);
    }
  }

  async create(dto: CreateMyModelDTO) {
    try {
      logger.info('Creating:', dto.Name);
      return await (prisma as any).myModel.create({ data: dto });
    } catch (error) {
      logger.error('Error:', error);
      throw new AppError('Error creating', 500);
    }
  }

  async update(id: number, dto: UpdateMyModelDTO) {
    try {
      return await (prisma as any).myModel.update({
        where: { Id: id },
        data: dto
      });
    } catch (error) {
      logger.error('Error:', error);
      throw new AppError('Error updating', 500);
    }
  }

  async delete(id: number) {
    try {
      await (prisma as any).myModel.delete({ where: { Id: id } });
      return true;
    } catch (error) {
      logger.error('Error:', error);
      throw new AppError('Error deleting', 500);
    }
  }
}
```

**Lưu ý**: Dùng `(prisma as any)` để tránh TypeScript issues

### Step 5: Tạo Controller

File: `src/controllers/myModelController.ts`

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { ApiResponse } from '../utils/response';
import { MyModelService } from '../services/myModelService';

const service = new MyModelService();

export const myModelController = {
  /**
   * @swagger
   * /api/mymodels:
   *   get:
   *     summary: Get all
   *     tags: [MyModel]
   */
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const data = await service.getAll(Number(page), Number(limit));
    ApiResponse.success(res, 'Success', data, 200);
  }),

  /**
   * @swagger
   * /api/mymodels/{id}:
   *   get:
   *     summary: Get by ID
   *     tags: [MyModel]
   */
  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getById(Number(req.params.id));
    ApiResponse.success(res, 'Success', data, 200);
  }),

  /**
   * @swagger
   * /api/mymodels:
   *   post:
   *     summary: Create
   *     tags: [MyModel]
   */
  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await service.create(req.body);
    ApiResponse.success(res, 'Created', data, 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await service.update(Number(req.params.id), req.body);
    ApiResponse.success(res, 'Updated', data, 200);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await service.delete(Number(req.params.id));
    ApiResponse.success(res, 'Deleted', null, 200);
  })
};
```

### Step 6: Tạo Routes

File: `src/routes/myModelRoutes.ts`

```typescript
import { Router } from 'express';
import { myModelController } from '../controllers/myModelController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', myModelController.getAll);
router.get('/:id', myModelController.getById);
router.post('/', authenticate, myModelController.create);
router.put('/:id', authenticate, myModelController.update);
router.delete('/:id', authenticate, myModelController.delete);

export default router;
```

### Step 7: Đăng ký Routes trong Server

Edit `src/server.ts`:

```typescript
// Import
import myModelRoutes from './routes/myModelRoutes';

// Register (trước error handler)
app.use('/api/mymodels', myModelRoutes);
```

**Happy Coding! 🚀**
