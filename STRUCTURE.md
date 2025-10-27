# Cấu trúc dự án E-Commerce Backend

## Tổng quan cấu trúc thư mục

```
E-ECOMMERCE-BE/
│
├── src/                          # Source code chính
│   ├── config/                   # Cấu hình
│   │   └── database.ts          # Kết nối SQL Server
│   │
│   ├── controllers/              # Controllers - xử lý HTTP requests
│   │   ├── userController.ts
│   │   ├── productController.ts
│   │   └── orderController.ts
│   │
│   ├── services/                 # Business logic layer
│   │   ├── userService.ts
│   │   ├── productService.ts
│   │   └── orderService.ts
│   │
│   ├── models/                   # Database models (nếu dùng ORM)
│   │
│   ├── routes/                   # API routes
│   │   ├── userRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── orderRoutes.ts
│   │
│   ├── middlewares/              # Custom middlewares
│   │   ├── errorHandler.ts      # Error handling
│   │   ├── authMiddleware.ts    # Authentication & Authorization
│   │   └── validationMiddleware.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.ts            # Logging
│   │   └── response.ts          # Response helpers
│   │
│   ├── types/                    # TypeScript types/interfaces
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── order.ts
│   │
│   ├── validators/               # Input validation
│   │   └── validators.ts
│   │
│   └── server.ts                # Entry point
│
├── dist/                         # Compiled JavaScript (build output)
├── logs/                         # Application logs
├── database/                     # SQL scripts
│   └── schema.sql               # Database schema
│
├── node_modules/                 # Dependencies
├── .env                         # Environment variables (không commit)
├── .env.example                 # Template cho .env
├── .gitignore                   # Git ignore rules
├── package.json                 # Project metadata & dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Documentation
```

## Chi tiết từng thư mục

### 📁 src/config/
Chứa các file cấu hình cho ứng dụng:
- **database.ts**: Cấu hình kết nối SQL Server với connection pooling

### 📁 src/controllers/
Controllers xử lý HTTP requests và responses:
- Nhận request từ routes
- Gọi services để xử lý business logic
- Trả về response cho client
- Xử lý errors

**Ví dụ**: `userController.ts` có các methods:
- `getAllUsers()` - GET all users
- `getUserById()` - GET user by ID
- `createUser()` - POST create new user
- `updateUser()` - PUT update user
- `deleteUser()` - DELETE user

### 📁 src/services/
Business logic layer:
- Xử lý logic nghiệp vụ phức tạp
- Tương tác với database
- Validation dữ liệu
- Transform data

**Tại sao tách riêng Services?**
- Tái sử dụng code
- Dễ test
- Clean architecture
- Separation of concerns

### 📁 src/routes/
Định nghĩa API endpoints:
- Map HTTP methods với controllers
- Áp dụng middlewares (auth, validation)
- Tổ chức routes theo resources

**Pattern**:
```typescript
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', middleware, controller.create);
router.put('/:id', middleware, controller.update);
router.delete('/:id', middleware, controller.delete);
```

### 📁 src/middlewares/
Custom middlewares:
- **errorHandler.ts**: Xử lý lỗi tập trung
- **authMiddleware.ts**: Xác thực & phân quyền
- **validationMiddleware.ts**: Validate input data

**Middleware pattern**:
```typescript
(req, res, next) => {
  // Logic here
  next(); // Pass to next middleware
}
```

### 📁 src/utils/
Helper functions và utilities:
- **logger.ts**: Logging system (file + console)
- **response.ts**: Standardized API responses

### 📁 src/types/
TypeScript interfaces và types:
- Định nghĩa cấu trúc data
- DTOs (Data Transfer Objects)
- Type safety

### 📁 src/validators/
Input validation logic:
- Validate user input
- Business rules validation
- Custom validators

### 📁 database/
SQL scripts:
- **schema.sql**: Database schema với tables, indexes, sample data

## Luồng xử lý Request

```
Client Request
    ↓
Routes (routes/)
    ↓
Middlewares (middlewares/)
    ↓
Controllers (controllers/)
    ↓
Services (services/)
    ↓
Database (config/database.ts)
    ↓
Response → Client
```

## Quy ước đặt tên

### Files
- camelCase: `userController.ts`, `productService.ts`
- Tên file phản ánh nội dung

### Classes
- PascalCase: `UserController`, `ProductService`

### Functions/Methods
- camelCase: `getAllUsers()`, `createProduct()`

### Variables
- camelCase: `userData`, `productList`

### Constants
- UPPER_SNAKE_CASE: `MAX_ITEMS`, `DEFAULT_PAGE_SIZE`

## Best Practices

### 1. **Separation of Concerns**
- Controllers: HTTP handling
- Services: Business logic
- Models: Data structure

### 2. **Error Handling**
- Sử dụng try-catch blocks
- Throw custom AppError
- Centralized error handler

### 3. **Async/Await**
- Sử dụng async/await thay vì callbacks
- Wrap async functions với asyncHandler

### 4. **Input Validation**
- Validate tất cả user input
- Sử dụng validators
- Return meaningful error messages

### 5. **Database Queries**
- Sử dụng parameterized queries (SQL injection prevention)
- Connection pooling
- Handle errors gracefully

### 6. **Logging**
- Log all important events
- Include timestamp
- Different log levels (info, warn, error)

### 7. **Security**
- Hash passwords (bcrypt)
- JWT for authentication
- HTTPS in production
- Rate limiting
- Input sanitization

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_USER=your_username
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_NAME=ECommerceDB
DB_PORT=1433

# Security
JWT_SECRET=your_secret_key
```

## Scripts npm

```bash
# Development với hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run tests
npm test
```

## API Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message",
  "errors": [ ... ]
}
```

### Paginated Response
```json
{
  "status": "success",
  "message": "Data retrieved",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Database Schema

### Main Tables
1. **Users** - Người dùng
2. **Categories** - Danh mục sản phẩm
3. **Products** - Sản phẩm
4. **Orders** - Đơn hàng
5. **OrderItems** - Chi tiết đơn hàng
6. **Carts** - Giỏ hàng
7. **Reviews** - Đánh giá sản phẩm
8. **Wishlist** - Danh sách yêu thích

## Mở rộng trong tương lai

### Features có thể thêm:
- [ ] JWT Authentication
- [ ] Password hashing (bcrypt)
- [ ] File upload (images)
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Real-time notifications (Socket.io)
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests (Jest)
- [ ] Docker containerization
- [ ] CI/CD pipeline

### Cải tiến cấu trúc:
- [ ] Sử dụng ORM (TypeORM, Prisma)
- [ ] Implement caching (Redis)
- [ ] Add GraphQL layer
- [ ] Microservices architecture
- [ ] Message queue (RabbitMQ)

## Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MSSQL Node.js Driver](https://github.com/tediousjs/node-mssql)
- [REST API Best Practices](https://restfulapi.net/)
