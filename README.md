# E-Commerce Backend API

Backend API cho dự án E-Commerce sử dụng Node.js, Express, TypeScript và SQL Server.

## Cấu trúc thư mục

```
E-ECOMMERCE-BE/
├── src/
│   ├── config/          # Cấu hình database và các config khác
│   ├── controllers/     # Controllers xử lý request/response
│   ├── services/        # Business logic
│   ├── models/          # Database models (nếu dùng ORM)
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── utils/           # Các hàm tiện ích
│   ├── types/           # TypeScript types/interfaces
│   ├── validators/      # Validation schemas
│   └── server.ts        # Entry point
├── dist/                # Build output
├── logs/                # Application logs
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies và scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Documentation
```

## Cài đặt

1. Clone repository
```bash
git clone <repository-url>
cd E-ECOMMERCE-BE
```

2. Cài đặt dependencies
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`
```bash
cp .env.example .env
```

4. Cập nhật thông tin database trong file `.env`

5. Tạo database và tables trong SQL Server (xem phần Database Schema)

## Database Schema

```sql
-- Users Table
CREATE TABLE Users (
    Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) DEFAULT 'user',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
);

-- Products Table
CREATE TABLE Products (
    Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18, 2) NOT NULL,
    Stock INT DEFAULT 0,
    Category NVARCHAR(100),
    ImageUrl NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
);

-- Orders Table
CREATE TABLE Orders (
    Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(50) FOREIGN KEY REFERENCES Users(Id),
    TotalAmount DECIMAL(18, 2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'pending',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
);

-- OrderItems Table
CREATE TABLE OrderItems (
    Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    OrderId NVARCHAR(50) FOREIGN KEY REFERENCES Orders(Id),
    ProductId NVARCHAR(50) FOREIGN KEY REFERENCES Products(Id),
    Quantity INT NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

## Scripts

```bash
# Development mode
npm run dev

# Build project
npm run build

# Start production server
npm start

# Run tests
npm test
```

## API Endpoints

### Users
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/:id` - Lấy user theo ID
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Products
- `GET /api/products` - Lấy danh sách products
- `GET /api/products/:id` - Lấy product theo ID
- `POST /api/products` - Tạo product mới
- `PUT /api/products/:id` - Cập nhật product
- `DELETE /api/products/:id` - Xóa product

### Orders
- `GET /api/orders` - Lấy danh sách orders
- `GET /api/orders/:id` - Lấy order theo ID
- `POST /api/orders` - Tạo order mới
- `PUT /api/orders/:id/status` - Cập nhật status order
- `DELETE /api/orders/:id` - Xóa order

## Technologies

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Programming language
- **MSSQL** - Database driver for SQL Server
- **dotenv** - Environment variables management

## License

ISC
