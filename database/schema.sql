-- DROP SCHEMA dbo;

CREATE SCHEMA dbo;
-- ECommerceDB.dbo.Banners definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.Banners;

CREATE TABLE ECommerceDB.dbo.Banners (
	Id int IDENTITY(1,1) NOT NULL,
	Title nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Subtitle nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Description nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Image nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ButtonText nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ButtonLink nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	BackgroundColor nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	IsActive bit DEFAULT 1 NULL,
	DisplayOrder int DEFAULT 0 NULL,
	CreatedAt datetime DEFAULT getdate() NULL,
	UpdatedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT PK__Banners__3214EC079771EA19 PRIMARY KEY (Id)
);
 CREATE NONCLUSTERED INDEX IX_Banners_DisplayOrder ON ECommerceDB.dbo.Banners (  DisplayOrder ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_Banners_IsActive ON ECommerceDB.dbo.Banners (  IsActive ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- ECommerceDB.dbo.LoginAttempts definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.LoginAttempts;

CREATE TABLE ECommerceDB.dbo.LoginAttempts (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	IpAddress nvarchar(45) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Username nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Success bit NOT NULL,
	AttemptedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT PK__LoginAtt__3214EC0797A7CD8F PRIMARY KEY (Id)
);
 CREATE NONCLUSTERED INDEX IX_LoginAttempts_AttemptedAt ON ECommerceDB.dbo.LoginAttempts (  AttemptedAt ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_LoginAttempts_IpAddress ON ECommerceDB.dbo.LoginAttempts (  IpAddress ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_LoginAttempts_Username ON ECommerceDB.dbo.LoginAttempts (  Username ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- ECommerceDB.dbo.Products definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.Products;

CREATE TABLE ECommerceDB.dbo.Products (
	Id int IDENTITY(1,1) NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Image] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Category nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Price decimal(18,2) NOT NULL,
	OriginalPrice decimal(18,2) NULL,
	Stock int NOT NULL,
	Rating float NULL,
	Reviews int NULL,
	Colors nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Sizes nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__Products__3214EC07BE189123 PRIMARY KEY (Id)
);


-- ECommerceDB.dbo.Users definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.Users;

CREATE TABLE ECommerceDB.dbo.Users (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Username nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Email nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PasswordHash nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Role] nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT 'user' NOT NULL,
	IsActive bit DEFAULT 1 NULL,
	EmailVerified bit DEFAULT 0 NULL,
	CreatedAt datetime DEFAULT getdate() NULL,
	UpdatedAt datetime DEFAULT getdate() NULL,
	LastLogin datetime NULL,
	Phone nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Name nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Address nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__Users__3214EC07E459DFD3 PRIMARY KEY (Id),
	CONSTRAINT UQ__Users__536C85E4907E9CE7 UNIQUE (Username)
);
 CREATE NONCLUSTERED INDEX IX_Users_Email ON ECommerceDB.dbo.Users (  Email ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_Users_Role ON ECommerceDB.dbo.Users (  Role ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_Users_Username ON ECommerceDB.dbo.Users (  Username ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- ECommerceDB.dbo.Carts definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.Carts;

CREATE TABLE ECommerceDB.dbo.Carts (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	UserId uniqueidentifier NOT NULL,
	CreatedAt datetime DEFAULT getdate() NOT NULL,
	UpdatedAt datetime DEFAULT getdate() NOT NULL,
	CONSTRAINT Carts_UserId_key UNIQUE (UserId),
	CONSTRAINT Carts_pkey PRIMARY KEY (Id),
	CONSTRAINT Carts_UserId_fkey FOREIGN KEY (UserId) REFERENCES ECommerceDB.dbo.Users(Id) ON DELETE CASCADE ON UPDATE CASCADE
);
 CREATE NONCLUSTERED INDEX Carts_UserId_idx ON ECommerceDB.dbo.Carts (  UserId ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- ECommerceDB.dbo.Orders definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.Orders;

CREATE TABLE ECommerceDB.dbo.Orders (
	Id int IDENTITY(1,1) NOT NULL,
	UserId uniqueidentifier NOT NULL,
	CreatedAt datetime DEFAULT getdate() NOT NULL,
	Total decimal(18,2) DEFAULT 0 NOT NULL,
	Status nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT 'pending' NOT NULL,
	PaymentMethod nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Notes nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__Orders__3214EC0740795220 PRIMARY KEY (Id),
	CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES ECommerceDB.dbo.Users(Id) ON DELETE CASCADE
);
 CREATE NONCLUSTERED INDEX IX_Orders_CreatedAt ON ECommerceDB.dbo.Orders (  CreatedAt ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_Orders_Status ON ECommerceDB.dbo.Orders (  Status ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_Orders_UserId ON ECommerceDB.dbo.Orders (  UserId ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- ECommerceDB.dbo.RefreshTokens definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.RefreshTokens;

CREATE TABLE ECommerceDB.dbo.RefreshTokens (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	UserId uniqueidentifier NOT NULL,
	Token nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ExpiresAt datetime NOT NULL,
	CreatedAt datetime DEFAULT getdate() NULL,
	Revoked bit DEFAULT 0 NULL,
	CONSTRAINT PK__RefreshT__3214EC07BC7DB2DA PRIMARY KEY (Id),
	CONSTRAINT UQ__RefreshT__1EB4F81784C4A03A UNIQUE (Token),
	CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) REFERENCES ECommerceDB.dbo.Users(Id) ON DELETE CASCADE
);
 CREATE NONCLUSTERED INDEX IX_RefreshTokens_ExpiresAt ON ECommerceDB.dbo.RefreshTokens (  ExpiresAt ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_RefreshTokens_Token ON ECommerceDB.dbo.RefreshTokens (  Token ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_RefreshTokens_UserId ON ECommerceDB.dbo.RefreshTokens (  UserId ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- ECommerceDB.dbo.CartItems definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.CartItems;

CREATE TABLE ECommerceDB.dbo.CartItems (
	Id int IDENTITY(1,1) NOT NULL,
	CartId uniqueidentifier NOT NULL,
	ProductId int NOT NULL,
	Quantity int DEFAULT 1 NOT NULL,
	CreatedAt datetime DEFAULT getdate() NOT NULL,
	UpdatedAt datetime DEFAULT getdate() NOT NULL,
	CONSTRAINT CartItems_CartId_ProductId_key UNIQUE (CartId,ProductId),
	CONSTRAINT CartItems_pkey PRIMARY KEY (Id),
	CONSTRAINT CartItems_CartId_fkey FOREIGN KEY (CartId) REFERENCES ECommerceDB.dbo.Carts(Id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT CartItems_ProductId_fkey FOREIGN KEY (ProductId) REFERENCES ECommerceDB.dbo.Products(Id) ON DELETE CASCADE ON UPDATE CASCADE
);
 CREATE NONCLUSTERED INDEX CartItems_CartId_idx ON ECommerceDB.dbo.CartItems (  CartId ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX CartItems_ProductId_idx ON ECommerceDB.dbo.CartItems (  ProductId ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- ECommerceDB.dbo.OrderItems definition

-- Drop table

-- DROP TABLE ECommerceDB.dbo.OrderItems;

CREATE TABLE ECommerceDB.dbo.OrderItems (
	Id int IDENTITY(1,1) NOT NULL,
	OrderId int NOT NULL,
	ProductId int NOT NULL,
	Quantity int DEFAULT 1 NOT NULL,
	Price decimal(18,2) NOT NULL,
	CONSTRAINT PK__OrderIte__3214EC076E51C2AD PRIMARY KEY (Id),
	CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES ECommerceDB.dbo.Orders(Id) ON DELETE CASCADE,
	CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES ECommerceDB.dbo.Products(Id) ON DELETE CASCADE
);
 CREATE NONCLUSTERED INDEX IX_OrderItems_OrderId ON ECommerceDB.dbo.OrderItems (  OrderId ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_OrderItems_ProductId ON ECommerceDB.dbo.OrderItems (  ProductId ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE ECommerceDB.dbo.OrderItems WITH NOCHECK ADD CONSTRAINT CK_OrderItems_Quantity CHECK (([Quantity]>(0)));
ALTER TABLE ECommerceDB.dbo.OrderItems WITH NOCHECK ADD CONSTRAINT CK_OrderItems_Price CHECK (([Price]>=(0)));


