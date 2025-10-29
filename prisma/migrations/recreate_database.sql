-- ==========================================
-- DROP ALL FOREIGN KEYS
-- ==========================================
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += N'ALTER TABLE ' + QUOTENAME(s.name) + N'.' + QUOTENAME(t.name)
    + N' DROP CONSTRAINT ' + QUOTENAME(fk.name) + N';'
FROM sys.foreign_keys AS fk
JOIN sys.tables AS t ON fk.parent_object_id = t.object_id
JOIN sys.schemas AS s ON t.schema_id = s.schema_id;

IF LEN(@sql) > 0
    EXEC sp_executesql @sql;
-- ==========================================

-- DROP TABLES IF EXIST
IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.RefreshTokens', 'U') IS NOT NULL DROP TABLE dbo.RefreshTokens;
IF OBJECT_ID('dbo.LoginAttempts', 'U') IS NOT NULL DROP TABLE dbo.LoginAttempts;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;

-- ==========================================
-- CREATE Users
-- ==========================================
CREATE TABLE dbo.Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(255) NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'user',
    IsActive BIT DEFAULT 1,
    EmailVerified BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    LastLogin DATETIME NULL,
    Phone NVARCHAR(20) NULL,
    Name NVARCHAR(100) NULL,
    Address NVARCHAR(255) NULL
);
CREATE INDEX IX_Users_Email ON dbo.Users(Email);
CREATE INDEX IX_Users_Role ON dbo.Users(Role);
CREATE INDEX IX_Users_Username ON dbo.Users(Username);

-- ==========================================
-- CREATE Products
-- ==========================================
CREATE TABLE dbo.Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Image NVARCHAR(500) NULL,
    Category NVARCHAR(100) NULL,
    Price DECIMAL(18, 2) NOT NULL,
    OriginalPrice DECIMAL(18, 2) NULL,
    Stock INT NOT NULL,
    Rating FLOAT NULL,
    Reviews INT NULL,
    Colors NVARCHAR(100) NULL,
    Sizes NVARCHAR(100) NULL
);

-- ==========================================
-- CREATE Orders
-- ==========================================
CREATE TABLE dbo.Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    Total DECIMAL(18, 2) NOT NULL DEFAULT 0,
    Status NVARCHAR(50) NOT NULL DEFAULT 'pending',
    PaymentMethod NVARCHAR(50) NULL,
    Notes NVARCHAR(255) NULL,
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId)
        REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
CREATE INDEX IX_Orders_UserId ON dbo.Orders(UserId);
CREATE INDEX IX_Orders_Status ON dbo.Orders(Status);
CREATE INDEX IX_Orders_CreatedAt ON dbo.Orders(CreatedAt);

-- ==========================================
-- CREATE OrderItems
-- ==========================================
CREATE TABLE dbo.OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    Price DECIMAL(18, 2) NOT NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders(Id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId)
        REFERENCES dbo.Products(Id) ON DELETE CASCADE,
    CONSTRAINT CK_OrderItems_Quantity CHECK (Quantity > 0),
    CONSTRAINT CK_OrderItems_Price CHECK (Price >= 0)
);
CREATE INDEX IX_OrderItems_OrderId ON dbo.OrderItems(OrderId);
CREATE INDEX IX_OrderItems_ProductId ON dbo.OrderItems(ProductId);

-- ==========================================
-- CREATE RefreshTokens
-- ==========================================
CREATE TABLE dbo.RefreshTokens (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(500) UNIQUE NOT NULL,
    ExpiresAt DATETIME NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Revoked BIT DEFAULT 0,
    CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId)
        REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
CREATE INDEX IX_RefreshTokens_UserId ON dbo.RefreshTokens(UserId);
CREATE INDEX IX_RefreshTokens_Token ON dbo.RefreshTokens(Token);
CREATE INDEX IX_RefreshTokens_ExpiresAt ON dbo.RefreshTokens(ExpiresAt);

-- ==========================================
-- CREATE LoginAttempts
-- ==========================================
CREATE TABLE dbo.LoginAttempts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    IpAddress NVARCHAR(45) NOT NULL,
    Username NVARCHAR(50) NULL,
    Success BIT NOT NULL,
    AttemptedAt DATETIME DEFAULT GETDATE()
);
CREATE INDEX IX_LoginAttempts_IpAddress ON dbo.LoginAttempts(IpAddress);
CREATE INDEX IX_LoginAttempts_Username ON dbo.LoginAttempts(Username);
CREATE INDEX IX_LoginAttempts_AttemptedAt ON dbo.LoginAttempts(AttemptedAt);

-- ==========================================
-- Summary Output
-- ==========================================
PRINT '=== DATABASE RECREATED SUCCESSFULLY ===';
PRINT 'All tables created with clean structure';
PRINT '- Users (with Name, Address, Phone)';
PRINT '- Products';
PRINT '- Orders (UserId -> Users)';
PRINT '- OrderItems';
PRINT '- RefreshTokens';
PRINT '- LoginAttempts';

-- ==========================================
-- Show All Tables
-- ==========================================
SELECT 
    t.name AS TableName,
    COUNT(c.column_id) AS ColumnCount
FROM sys.tables t
LEFT JOIN sys.columns c ON t.object_id = c.object_id
GROUP BY t.name
ORDER BY t.name;
