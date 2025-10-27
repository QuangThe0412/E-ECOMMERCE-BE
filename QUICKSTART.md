# 🚀 Hướng dẫn khởi động nhanh

## Bước 1: Cài đặt Dependencies

```bash
npm install
```

## Bước 2: Cấu hình Database

### 2.1. Tạo file .env

Sao chép file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

### 2.2. Cập nhật thông tin Database trong .env

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_USER=sa                    # Thay bằng username SQL Server của bạn
DB_PASSWORD=YourPassword123   # Thay bằng password của bạn
DB_SERVER=localhost           # Hoặc IP server của bạn
DB_NAME=ECommerceDB
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true
```

## Bước 3: Tạo Database

### 3.1. Mở SQL Server Management Studio (SSMS)

### 3.2. Tạo Database mới

```sql
CREATE DATABASE ECommerceDB;
GO
```

### 3.3. Chạy Schema Script

Mở file `database/schema.sql` và execute toàn bộ script trong SSMS để tạo:
- Tables
- Indexes
- Sample data

Hoặc chạy từ command line:

```bash
sqlcmd -S localhost -U sa -P YourPassword123 -i database/schema.sql
```

## Bước 4: Kiểm tra kết nối

Chạy server ở chế độ development:

```bash
npm run dev
```

Nếu thành công, bạn sẽ thấy:
```
Connected to SQL Server successfully
Server is running on port 3000
Server is running on http://localhost:3000
```

## Bước 5: Test API

### 5.1. Health Check

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000/health

# hoặc dùng curl
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 5.2. Test các API endpoints

#### Get all users
```bash
curl http://localhost:3000/api/users
```

#### Get user by ID
```bash
curl http://localhost:3000/api/users/user-001
```

#### Create new user
```bash
curl -X POST http://localhost:3000/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"name\":\"Test User\",\"password\":\"123456\"}"
```

#### Get all products
```bash
curl http://localhost:3000/api/products
```

#### Get products with pagination and search
```bash
curl "http://localhost:3000/api/products?page=1&limit=5&search=phone"
```

## Các lệnh npm có sẵn

```bash
# Chạy development server (với hot reload)
npm run dev

# Build TypeScript sang JavaScript
npm run build

# Chạy production server (sau khi build)
npm start

# Run tests
npm test
```

## Cấu trúc API Endpoints

### Users
- `GET    /api/users`       - Lấy danh sách users (có phân trang)
- `GET    /api/users/:id`   - Lấy user theo ID
- `POST   /api/users`       - Tạo user mới
- `PUT    /api/users/:id`   - Cập nhật user
- `DELETE /api/users/:id`   - Xóa user

### Products
- `GET    /api/products`       - Lấy danh sách products (có phân trang, search, filter)
- `GET    /api/products/:id`   - Lấy product theo ID
- `POST   /api/products`       - Tạo product mới
- `PUT    /api/products/:id`   - Cập nhật product
- `DELETE /api/products/:id`   - Xóa product

### Orders
- `GET    /api/orders`            - Lấy danh sách orders (có phân trang, filter)
- `GET    /api/orders/:id`        - Lấy order theo ID
- `POST   /api/orders`            - Tạo order mới
- `PUT    /api/orders/:id/status` - Cập nhật status order
- `DELETE /api/orders/:id`        - Xóa order

## Query Parameters

### Pagination
```
?page=1&limit=10
```

### Search (Products)
```
?search=smartphone
```

### Filter by Category (Products)
```
?category=Electronics
```

### Filter by Status (Orders)
```
?status=pending
```

### Kết hợp nhiều params
```
?page=1&limit=5&search=phone&category=Electronics
```

## Troubleshooting

### Lỗi: Cannot connect to database

**Giải pháp:**
1. Kiểm tra SQL Server đang chạy
2. Kiểm tra thông tin kết nối trong .env
3. Kiểm tra firewall cho phép port 1433
4. Thử kết nối bằng SSMS với cùng thông tin

### Lỗi: Login failed for user

**Giải pháp:**
1. Kiểm tra username và password trong .env
2. Enable SQL Server Authentication
3. Đảm bảo user có quyền truy cập database

### Lỗi: TypeScript compilation errors

**Giải pháp:**
```bash
# Cài lại dependencies
npm install

# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi: Port 3000 already in use

**Giải pháp:**
1. Đổi PORT trong .env sang port khác (vd: 3001)
2. Hoặc tắt process đang dùng port 3000

## Logs

Logs được lưu trong thư mục `logs/`:
- Format: `app-YYYY-MM-DD.log`
- Chứa tất cả info, error, warning logs

## Next Steps

1. ✅ Setup xong cơ bản
2. 🔐 Implement JWT Authentication
3. 🔒 Hash passwords với bcrypt
4. 📧 Add email notifications
5. 💳 Integrate payment gateway
6. 📝 Add API documentation (Swagger)
7. 🧪 Write unit tests

## Tài liệu chi tiết

Đọc thêm:
- `README.md` - Tổng quan project
- `STRUCTURE.md` - Chi tiết cấu trúc dự án
- `database/schema.sql` - Database schema

## Liên hệ & Support

Nếu gặp vấn đề, hãy check:
1. Console logs
2. Application logs trong thư mục `logs/`
3. SQL Server logs

---

**Happy Coding! 🎉**
