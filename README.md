# E-Commerce Backend API

Backend API for E-Commerce application built with Express, TypeScript, Prisma and SQL Server.

## Environment Configuration

The application uses different environment files based on the environment:

### Development Environment (`.env.dev`)
- Swagger documentation is **enabled**
- Detailed logging
- Hot reload with tsx watch
- File: `.env.dev`

### Production Environment (`.env`)
- Swagger documentation is **disabled** (returns 403)
- Optimized logging
- Compiled JavaScript execution
- File: `.env`

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

**For Development:**
```bash
cp .env.example .env.dev
```
Edit `.env.dev` with your development database and settings.

**For Production:**
```bash
cp .env.example .env
```
Edit `.env` with your production database and settings.

**Important:** Don't set `NODE_ENV` in the files - it's automatically set by npm scripts.

### 3. Run Database Migrations
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Application

**Development mode** (with Swagger):
```bash
npm run dev
```
- Server: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

**Production mode** (without Swagger):
```bash
npm run build
npm start
```
- Server: http://localhost:3000
- Swagger: Disabled (403 Forbidden)

**Development build** (compiled but with dev env):
```bash
npm run build
npm run start:dev
```

## API Endpoints

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/products` - Product catalog
- `/api/orders` - Order management
- `/api/cart` - Shopping cart
- `/api/banners` - Banner management
- `/api-docs` - Swagger documentation (dev only)

## Scripts

- `npm run dev` - Run development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server (NODE_ENV=production)
- `npm run start:dev` - Run built app in development mode

## Tech Stack

- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **SQL Server** - Database
- **JWT** - Authentication
- **Swagger** - API documentation (dev only)
