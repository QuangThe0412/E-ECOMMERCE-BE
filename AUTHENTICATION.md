# E-Commerce Backend Authentication System

## ✅ Authentication System - Hoàn thành!

Hệ thống authentication đã được tích hợp hoàn chỉnh với các tính năng:

### 🔐 Tính năng

- ✅ **Login** với username/password
- ✅ **Register** user mới
- ✅ **JWT Token** authentication (1 hour expiration)
- ✅ **Refresh Token** (7 days expiration)
- ✅ **Token Verification**
- ✅ **Logout** với token revocation
- ✅ **Password Hashing** với bcrypt
- ✅ **Rate Limiting**:
  - Login: 5 attempts per 15 minutes
  - Register: 3 attempts per hour
  - General API: 100 requests per minute
- ✅ **Role-Based Access Control** (Admin & User roles)
- ✅ **Login Attempts Tracking**

### 📊 Database Tables

Đã tạo 3 tables:
- **Users_Auth**: Lưu thông tin user (username, email, password hash, role)
- **RefreshTokens**: Quản lý refresh tokens
- **LoginAttempts**: Tracking login attempts cho rate limiting

### 👤 Default Users

```
Username: admin
Password: admin123
Role: admin

Username: user  
Password: admin123
Role: user
```

## 🚀 API Endpoints

### Base URL
```
http://localhost:3000/api/auth
```

### 1. Login
**POST** `/api/auth/login`

Request:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2. Register
**POST** `/api/auth/register`

Request:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 3. Verify Token
**GET** `/api/auth/verify`

Headers:
```
Authorization: Bearer {your-token}
```

### 4. Refresh Token
**POST** `/api/auth/refresh`

Request:
```json
{
  "refreshToken": "your-refresh-token"
}
```

### 5. Logout
**POST** `/api/auth/logout`

Headers:
```
Authorization: Bearer {your-token}
```

Request:
```json
{
  "refreshToken": "your-refresh-token"
}
```

### 6. Get Current User
**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer {your-token}
```

## 🔒 Protected Routes

Để protect routes, sử dụng middleware:

```typescript
import { authenticate, authorize } from './middlewares/authMiddleware';

// Require authentication
router.get('/profile', authenticate, controller.getProfile);

// Require admin role
router.get('/admin', authenticate, authorize('admin'), controller.adminOnly);

// Multiple roles
router.get('/staff', authenticate, authorize('admin', 'staff'), controller.staffOnly);
```

## 📚 API Documentation

Swagger UI: http://localhost:3000/api-docs

Tất cả authentication endpoints đã được document đầy đủ với:
- Request/Response schemas
- Error codes
- Bearer authentication
- Rate limiting info

## 🧪 Testing với cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Verify Token
```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Environment Variables

Đã cấu hình trong `.env`:

```env
# JWT Configuration
JWT_SECRET=e-commerce-super-secret-key-2024-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

⚠️ **Important**: Thay đổi `JWT_SECRET` trong production!

## 📝 Error Codes

| Code | Message | Status |
|------|---------|--------|
| INVALID_CREDENTIALS | Tên đăng nhập hoặc mật khẩu không đúng | 401 |
| USER_INACTIVE | Tài khoản bị khóa | 403 |
| TOKEN_EXPIRED | Token đã hết hạn | 401 |
| TOKEN_INVALID | Token không hợp lệ | 401 |
| TOKEN_MISSING | Token không được cung cấp | 401 |
| TOO_MANY_ATTEMPTS | Quá nhiều lần đăng nhập thất bại | 429 |
| TOO_MANY_REGISTRATIONS | Quá nhiều lần đăng ký | 429 |
| USERNAME_EXISTS | Tên đăng nhập đã tồn tại | 409 |
| EMAIL_EXISTS | Email đã tồn tại | 409 |
| WEAK_PASSWORD | Mật khẩu yếu | 400 |
| PASSWORD_MISMATCH | Mật khẩu không khớp | 400 |

## 🔄 Frontend Integration

### 1. Login Flow
```typescript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const data = await response.json();
// Save token and refreshToken to localStorage
localStorage.setItem('token', data.data.token);
localStorage.setItem('refreshToken', data.data.refreshToken);
```

### 2. Authenticated Requests
```typescript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Token Refresh
```typescript
const refreshToken = localStorage.getItem('refreshToken');

const response = await fetch('http://localhost:3000/api/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});

const data = await response.json();
// Update tokens
localStorage.setItem('token', data.data.token);
localStorage.setItem('refreshToken', data.data.refreshToken);
```

## 🛠️ Database Migration

Để chạy lại migration:
```bash
npx tsx src/migrate.ts
```

## 📦 Installed Packages

- `jsonwebtoken` - JWT token generation/verification
- `bcrypt` - Password hashing
- `express-rate-limit` - Rate limiting middleware

## ✨ Next Steps

Bạn có thể:
1. Test tất cả endpoints qua Swagger UI
2. Integrate vào frontend React/Next.js của bạn
3. Customize error messages
4. Add email verification
5. Add password reset functionality
6. Add 2FA (Two-Factor Authentication)
7. Add OAuth (Google, Facebook login)

## 🎉 Summary

Hệ thống authentication đã sẵn sàng sử dụng với:
- ✅ Secure password hashing
- ✅ JWT-based authentication
- ✅ Refresh token rotation
- ✅ Rate limiting protection
- ✅ Role-based access control
- ✅ Complete API documentation
- ✅ Error handling with proper codes
- ✅ Database migration system

**Server đang chạy tại**: http://localhost:3000
**API Docs**: http://localhost:3000/api-docs
