-- Create Database
-- CREATE DATABASE ECommerceDB;
-- GO

-- USE ECommerceDB;
-- GO

-- =============================================
-- Users Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        Email NVARCHAR(255) UNIQUE NOT NULL,
        Name NVARCHAR(255) NOT NULL,
        Password NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) DEFAULT 'user',
        PhoneNumber NVARCHAR(20),
        Address NVARCHAR(500),
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME,
        CONSTRAINT CHK_Email CHECK (Email LIKE '%@%.%')
    );
END
GO

-- =============================================
-- Categories Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX),
        ImageUrl NVARCHAR(500),
        ParentId NVARCHAR(50),
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME,
        FOREIGN KEY (ParentId) REFERENCES Categories(Id)
    );
END
GO

-- =============================================
-- Products Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX),
        Price DECIMAL(18, 2) NOT NULL,
        ComparePrice DECIMAL(18, 2),
        Cost DECIMAL(18, 2),
        Stock INT DEFAULT 0,
        SKU NVARCHAR(100) UNIQUE,
        CategoryId NVARCHAR(50),
        ImageUrl NVARCHAR(500),
        Images NVARCHAR(MAX), -- JSON array of image URLs
        IsActive BIT DEFAULT 1,
        IsFeatured BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME,
        FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
        CONSTRAINT CHK_Price CHECK (Price >= 0),
        CONSTRAINT CHK_Stock CHECK (Stock >= 0)
    );
END
GO

-- =============================================
-- Orders Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE Orders (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(50) NOT NULL,
        OrderNumber NVARCHAR(50) UNIQUE NOT NULL,
        SubTotal DECIMAL(18, 2) NOT NULL,
        ShippingFee DECIMAL(18, 2) DEFAULT 0,
        Tax DECIMAL(18, 2) DEFAULT 0,
        Discount DECIMAL(18, 2) DEFAULT 0,
        TotalAmount DECIMAL(18, 2) NOT NULL,
        Status NVARCHAR(50) DEFAULT 'pending',
        PaymentMethod NVARCHAR(100),
        PaymentStatus NVARCHAR(50) DEFAULT 'pending',
        ShippingAddress NVARCHAR(MAX), -- JSON object
        BillingAddress NVARCHAR(MAX), -- JSON object
        Notes NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME,
        CompletedAt DATETIME,
        FOREIGN KEY (UserId) REFERENCES Users(Id),
        CONSTRAINT CHK_Status CHECK (Status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
        CONSTRAINT CHK_PaymentStatus CHECK (PaymentStatus IN ('pending', 'paid', 'failed', 'refunded'))
    );
END
GO

-- =============================================
-- OrderItems Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        OrderId NVARCHAR(50) NOT NULL,
        ProductId NVARCHAR(50) NOT NULL,
        ProductName NVARCHAR(255) NOT NULL,
        ProductSKU NVARCHAR(100),
        Quantity INT NOT NULL,
        Price DECIMAL(18, 2) NOT NULL,
        Discount DECIMAL(18, 2) DEFAULT 0,
        TotalPrice DECIMAL(18, 2) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
        FOREIGN KEY (ProductId) REFERENCES Products(Id),
        CONSTRAINT CHK_Quantity CHECK (Quantity > 0)
    );
END
GO

-- =============================================
-- Carts Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Carts')
BEGIN
    CREATE TABLE Carts (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(50) NOT NULL,
        ProductId NVARCHAR(50) NOT NULL,
        Quantity INT NOT NULL DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME,
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        CONSTRAINT CHK_Cart_Quantity CHECK (Quantity > 0),
        CONSTRAINT UQ_User_Product UNIQUE (UserId, ProductId)
    );
END
GO

-- =============================================
-- Reviews Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reviews')
BEGIN
    CREATE TABLE Reviews (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(50) NOT NULL,
        ProductId NVARCHAR(50) NOT NULL,
        OrderId NVARCHAR(50),
        Rating INT NOT NULL,
        Title NVARCHAR(255),
        Comment NVARCHAR(MAX),
        IsVerified BIT DEFAULT 0,
        IsApproved BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME,
        FOREIGN KEY (UserId) REFERENCES Users(Id),
        FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        FOREIGN KEY (OrderId) REFERENCES Orders(Id),
        CONSTRAINT CHK_Rating CHECK (Rating >= 1 AND Rating <= 5)
    );
END
GO

-- =============================================
-- Wishlist Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Wishlist')
BEGIN
    CREATE TABLE Wishlist (
        Id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(50) NOT NULL,
        ProductId NVARCHAR(50) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        CONSTRAINT UQ_User_Product_Wishlist UNIQUE (UserId, ProductId)
    );
END
GO

-- =============================================
-- Create Indexes for better performance
-- =============================================
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);
CREATE INDEX IX_Products_IsActive ON Products(IsActive);
CREATE INDEX IX_Orders_UserId ON Orders(UserId);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_Orders_CreatedAt ON Orders(CreatedAt);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_OrderItems_ProductId ON OrderItems(ProductId);
CREATE INDEX IX_Reviews_ProductId ON Reviews(ProductId);
CREATE INDEX IX_Reviews_UserId ON Reviews(UserId);
GO

-- =============================================
-- Insert Sample Data (Optional)
-- =============================================

-- Insert sample categories
INSERT INTO Categories (Id, Name, Description) VALUES
('cat-001', 'Electronics', 'Electronic devices and accessories'),
('cat-002', 'Fashion', 'Clothing and fashion accessories'),
('cat-003', 'Home & Garden', 'Home decor and gardening items'),
('cat-004', 'Books', 'Books and publications'),
('cat-005', 'Sports', 'Sports equipment and accessories');
GO

-- Insert sample users (password: 123456 - should be hashed in production)
INSERT INTO Users (Id, Email, Name, Password, Role) VALUES
('user-001', 'admin@example.com', 'Admin User', '$2a$10$hashed_password_here', 'admin'),
('user-002', 'john.doe@example.com', 'John Doe', '$2a$10$hashed_password_here', 'user'),
('user-003', 'jane.smith@example.com', 'Jane Smith', '$2a$10$hashed_password_here', 'user');
GO

-- Insert sample products
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId, SKU) VALUES
('prod-001', 'Smartphone X', 'Latest smartphone with advanced features', 599.99, 50, 'cat-001', 'SPH-X-001'),
('prod-002', 'Laptop Pro', 'High-performance laptop for professionals', 1299.99, 30, 'cat-001', 'LAP-PRO-001'),
('prod-003', 'T-Shirt Classic', 'Comfortable cotton t-shirt', 29.99, 100, 'cat-002', 'TSH-CLS-001'),
('prod-004', 'Running Shoes', 'Professional running shoes', 89.99, 75, 'cat-005', 'SHO-RUN-001'),
('prod-005', 'Garden Tool Set', 'Complete set of garden tools', 149.99, 40, 'cat-003', 'GRD-SET-001');
GO

-- Insert sample order
INSERT INTO Orders (Id, UserId, OrderNumber, SubTotal, TotalAmount, Status) VALUES
('order-001', 'user-002', 'ORD-20240001', 629.98, 629.98, 'pending');
GO

-- Insert sample order items
INSERT INTO OrderItems (OrderId, ProductId, ProductName, ProductSKU, Quantity, Price, TotalPrice) VALUES
('order-001', 'prod-001', 'Smartphone X', 'SPH-X-001', 1, 599.99, 599.99),
('order-001', 'prod-003', 'T-Shirt Classic', 'TSH-CLS-001', 1, 29.99, 29.99);
GO

PRINT 'Database schema created successfully!';
