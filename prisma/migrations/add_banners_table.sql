-- Add Banners table to database
USE ECommerceDB;
GO

-- Create Banners table
CREATE TABLE Banners (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Subtitle NVARCHAR(500) NULL,
    Description NVARCHAR(1000) NULL,
    Image NVARCHAR(500) NOT NULL,
    ButtonText NVARCHAR(100) NULL,
    ButtonLink NVARCHAR(500) NULL,
    BackgroundColor NVARCHAR(100) NULL,
    IsActive BIT DEFAULT 1,
    DisplayOrder INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE INDEX IX_Banners_IsActive ON Banners(IsActive);
CREATE INDEX IX_Banners_DisplayOrder ON Banners(DisplayOrder);
GO

-- Insert sample data
INSERT INTO Banners (Title, Subtitle, Description, Image, ButtonText, ButtonLink, BackgroundColor, DisplayOrder)
VALUES 
('Bộ Sưu Tập Mùa Hè 2025', 'Thời trang nhẹ nhàng, thoải mái cho mùa hè sôi động', 'Khám phá những thiết kế mới nhất với chất liệu thoáng mát', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=600&fit=crop', 'Khám Phá Ngay', '/products?category=Áo', 'from-blue-500 to-purple-600', 1),
('Giảm Giá Đến 50%', 'Săn sale khủng - Thời trang cao cấp', 'Cơ hội sở hữu những món đồ yêu thích với giá ưu đãi', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop', 'Mua Ngay', '/products', 'from-orange-500 to-red-600', 2),
('Phong Cách Hiện Đại', 'Xu hướng thời trang đương đại', 'Nâng tầm phong cách với những thiết kế độc đáo, sang trọng', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=600&fit=crop', 'Xem Bộ Sưu Tập', '/products?category=Phụ kiện', 'from-green-500 to-teal-600', 3),
('Thời Trang Nam Lịch Lãm', 'Vẻ đẹp nam tính và mạnh mẽ', 'Bộ sưu tập dành riêng cho phái mạnh tự tin', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&h=600&fit=crop', 'Mua Sắm Nam', '/products?category=Quần', 'from-gray-700 to-gray-900', 4),
('Giày Sneaker Hot Trend', 'Bước đi phong cách, tự tin mỗi ngày', 'Những đôi giày sneaker được yêu thích nhất năm', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=600&fit=crop', 'Xem Giày', '/products?category=Giày', 'from-pink-500 to-rose-600', 5);

PRINT 'Banners table created and sample data inserted!';
GO
