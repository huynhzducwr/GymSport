Create database QLGymSport


use QLGymSport



create table UserRoles(
RoleID int primary key IDENTITY(1,1),
RoleName nvarchar(50),
IsActive BIT Default 1,
Description nvarchar(255)
);
Go
CREATE PROCEDURE CreateUserRole
    @RoleName NVARCHAR(50),
    @Description NVARCHAR(255),
    @IsActive BIT = 1 -- Default to active
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO UserRoles (RoleName, Description, IsActive)
    VALUES (@RoleName, @Description, @IsActive);

    -- Return the new RoleID
    SELECT SCOPE_IDENTITY() AS NewRoleID;
END;
GO




CREATE OR ALTER PROCEDURE ListAllUserRoles
    @IsActive BIT = NULL  -- Tham số tuỳ chọn để lọc theo trạng thái IsActive
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu @IsActive là NULL, lấy tất cả các role
    IF @IsActive IS NULL
    BEGIN
        SELECT 
            RoleID,
            RoleName,
            Description,
            IsActive
        FROM 
            UserRoles
        ORDER BY 
            RoleID;  -- Có thể thay đổi cột sắp xếp nếu cần
    END
    ELSE
    BEGIN
        -- Nếu @IsActive được truyền vào, chỉ lấy các role có trạng thái IsActive tương ứng
        SELECT 
            RoleID,
            RoleName,
            Description,
            IsActive
        FROM 
            UserRoles
        WHERE 
            IsActive = @IsActive
        ORDER BY 
            RoleID;  -- Có thể thay đổi cột sắp xếp nếu cần
    END
END;
GO


CREATE or alter PROCEDURE DeleteUserRole
    @RoleID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Log RoleID received for debugging
    PRINT 'Received RoleID: ' + CAST(@RoleID AS NVARCHAR(10));
    
    -- Check if the role exists
    IF EXISTS (SELECT 1 FROM UserRoles WHERE RoleID = @RoleID)
    BEGIN
        -- Log role found
        PRINT 'Role found, proceeding with deletion.';
        
        -- Delete the role
        DELETE FROM UserRoles WHERE RoleID = @RoleID;
        
        -- Log success
        PRINT 'Role deleted successfully.';
    END
    ELSE
    BEGIN
        -- Log role not found
        PRINT 'RoleID not found.';
    END
END;
GO




CREATE PROCEDURE ToggleUserRoleActiveStatus
    @RoleID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if the role exists
    IF EXISTS (SELECT 1 FROM UserRoles WHERE RoleID = @RoleID)
    BEGIN
        -- Toggle the IsActive status (if 1, set to 0; if 0, set to 1)
        UPDATE UserRoles
        SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END
        WHERE RoleID = @RoleID;
        
        PRINT 'The IsActive status has been toggled successfully.';
    END
    ELSE
    BEGIN
        PRINT 'RoleID not found.';
    END
END;
GO


	create table Users (

	userID int primary key identity(1,1),
	RoleID int,
	Email nvarchar(100) unique not null,
	firstname nvarchar(50) not null,
	lastname nvarchar(50) not null,
	PasswordHash Nvarchar(255),
	CreatedAt Datetime default getdate(),
	LastLogin Datetime,
	IsActive bit default 1,
	CreatedBy nvarchar(100),
	CreatedDate Datetime default getdate(),
	ModifiedBy nvarchar(100),
	ModifiedDate datetime,
	foreign key (RoleID) references UserRoles(RoleID)
	);

	ALTER TABLE Users
	ADD 
		EmailVerified BIT DEFAULT 0, -- 0: Chưa xác minh, 1: Đã xác minh
		VerificationToken NVARCHAR(255), -- Token để xác minh email
		VerificationTokenExpiry DATETIME; -- Thời gian hết hạn của token



		go

Insert into UserRoles(RoleName,Description) Values
('Admin','Administrtor with full access'),
('User','User with limited access'),
('Manager','seller with extended access');



create table ProductCategory(
ProductCategoryID int primary key identity(1,1),
ProductCategoryName nvarchar(100),
Description nvarchar(100) null,
isActive bit default 1,
CreatedBy nvarchar(100),
CreatedDate Datetime default getdate(),
ModifiedBy nvarchar(100),
ModifiedDate datetime
);


create table AccessoriesCategory(
AccessoriesCategoryID int primary key identity(1,1),
AccessoriesCateName nvarchar(100),
Description nvarchar(100) null,
isActive bit default 1,
CreatedBy nvarchar(100),
CreatedDate datetime default getdate(),
ModifiedBy nvarchar(100),
ModifiedDate datetime
);

create table Products(
ProductID int primary key identity(1,1),
ProductName nvarchar(150),
Description nvarchar(max),
Price Decimal(10,2),
isActive bit Default 1,
ProductCategoryID int,
ModifiedBy nvarchar(100),
ModifiedDate datetime,
isLove bit default 0,
Status nvarchar(50) check (Status in ('Available','Sold Out')),
foreign key (ProductCategoryID) references ProductCategory(ProductCategoryID)
)

CREATE TABLE UserFavorites (
    FavoriteID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(userID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    UNIQUE (UserID, ProductID) -- M?t ngu?i dùng ch? có th? yêu thích m?t s?n ph?m m?t l?n
);


ALTER TABLE UserFavorites
ADD 
    ProductName nvarchar(150),
    Description nvarchar(max),
    Price decimal(10, 2),
    ProductCategoryName nvarchar(150),
    ImageID int,
    ImageURL nvarchar(max);


create table Accessories(
AccessoriesID int primary key identity(1,1),
AccessoriesName nvarchar(150),
Description nvarchar(max),
Price Decimal(10,2),
AccessoriesCategoryID int,
isActive bit default 1,
ModifiedBy nvarchar(100),
ModifiedDate datetime,
isLove bit default 0,
Status nvarchar(50) check (Status in ('Available','Sold Out')),
foreign key (AccessoriesCategoryID) references AccessoriesCategory(AccessoriesCategoryID)
)


create table Colors(
ColorID int primary key identity(1,1),
ColorName nvarchar(50),
isActive bit default 1
)

create table Sizes(
SizeID int primary key identity(1,1),
SizeName nvarchar(50),
isActive bit default 1
)

create table Images(
ImageID int primary key identity(1,1),
ProductID int,
ImageURL nvarchar(max),
foreign key (ProductID) references Products(ProductID)
)

create table ProductColors(
ProductID int,
ColorID int,
foreign key (ProductID) references Products(ProductID),
foreign key (ColorID) references Colors(ColorID),
primary key (ProductID,ColorID)
)

create table ProductSizes(
ProductID int,
SizeID int,
foreign key (ProductID) references Products(ProductID),
foreign key (SizeID) references Sizes(SizeID),
primary key (ProductID,SizeID)
)

create table Discount(
DiscountID int primary key identity(1,1),
 DiscountCode nvarchar(50),
DiscountPercent decimal(5,2) not null,
Description nvarchar(255) null,
isActive bit default 1,
CreateAt DateTime default getdate()
)
go
ALTER TABLE Discount
DROP COLUMN Description;

go
ALTER TABLE Discount
ADD EffectiveDate DATETIME NULL,
    ExpirationDate DATETIME NULL;

	ALTER TABLE Discount
	add CreatedBy nvarchar(50) null

	go

CREATE OR ALTER PROCEDURE spCreateDiscount
    @DiscountCode NVARCHAR(50),
    @DiscountPercent DECIMAL(5,2),
    @EffectiveDate DATETIME = NULL,
    @ExpirationDate DATETIME = NULL,
    @CreatedBy NVARCHAR(50),
    @DiscountID INT OUTPUT,  -- Để trả về DiscountID mới tạo
    @IsSuccess BIT OUTPUT    -- Để kiểm tra xem tạo mã giảm giá có thành công hay không
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra ngày hiệu lực và ngày hết hạn
    IF @EffectiveDate < GETDATE() 
    BEGIN
        SET @IsSuccess = 0;
        PRINT 'Error: Effective Date cannot be earlier than today.';
        RETURN;
    END

    IF @ExpirationDate < @EffectiveDate
    BEGIN
        SET @IsSuccess = 0;
        PRINT 'Error: Expiration Date cannot be earlier than Effective Date.';
        RETURN;
    END

    BEGIN TRY
        -- Bước 1: Thêm mã giảm giá mới vào bảng Discount
        INSERT INTO Discount (DiscountCode, DiscountPercent, EffectiveDate, ExpirationDate, CreatedBy)
        VALUES (@DiscountCode, @DiscountPercent, @EffectiveDate, @ExpirationDate, @CreatedBy);

        -- Bước 2: Lấy DiscountID vừa tạo
        SET @DiscountID = SCOPE_IDENTITY();

        -- Bước 3: Nếu không có lỗi, đặt @IsSuccess = 1
        SET @IsSuccess = 1;
    END TRY
    BEGIN CATCH
        -- Bước 4: Xử lý lỗi, nếu có lỗi thì đặt @IsSuccess = 0
        SET @IsSuccess = 0;
    END CATCH
END
GO


 CREATE OR ALTER PROCEDURE spDeleteDiscount
    @DiscountID INT,
    @IsSuccess BIT OUTPUT    -- Để kiểm tra xem xóa mã giảm giá có thành công hay không
AS
BEGIN
    SET NOCOUNT ON;

    -- Bước 1: Kiểm tra xem mã giảm giá có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM Discount WHERE DiscountID = @DiscountID)
    BEGIN
        SET @IsSuccess = 0;
        PRINT 'Error: DiscountID not found.';
        RETURN;
    END

    BEGIN TRY
        -- Bước 2: Xóa mã giảm giá
        DELETE FROM Discount WHERE DiscountID = @DiscountID;

        -- Bước 3: Kiểm tra nếu có bản ghi bị xóa
        IF @@ROWCOUNT = 0
        BEGIN
            SET @IsSuccess = 0;
            PRINT 'Error: DiscountID not found or delete failed.';
            RETURN;
        END

        -- Bước 4: Nếu không có lỗi, đặt @IsSuccess = 1
        SET @IsSuccess = 1;
    END TRY
    BEGIN CATCH
        -- Bước 5: Xử lý lỗi, nếu có lỗi thì đặt @IsSuccess = 0
        SET @IsSuccess = 0;
        PRINT ERROR_MESSAGE();
    END CATCH
END
GO
CREATE OR ALTER PROCEDURE spGetAllDiscounts
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Lấy tất cả các mã giảm giá từ bảng Discount
        SELECT 
            DiscountID,
            DiscountCode,
            DiscountPercent,
            EffectiveDate,
            ExpirationDate,
			isActive,
            CreatedBy,
            CreateAt
        FROM Discount;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, trả về thông báo lỗi
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO



	CREATE OR ALTER PROCEDURE spApplyDiscount
		@OrderID INT,
		@DiscountCode NVARCHAR(50),
		@AppliedDiscount DECIMAL(5,2) OUTPUT, -- Trả về số tiền giảm giá áp dụng
		@TotalAmount DECIMAL(10,2) OUTPUT, -- Tổng giá trị đơn hàng sau khi áp dụng giảm giá
		@IsSuccess BIT OUTPUT  -- Kiểm tra xem việc áp dụng giảm giá có thành công hay không
	AS
	BEGIN
		SET NOCOUNT ON;

		-- Khai báo các biến
		DECLARE @DiscountPercent DECIMAL(5,2);
		DECLARE @EffectiveDate DATETIME;
		DECLARE @ExpirationDate DATETIME;

		-- Lấy thông tin giảm giá từ mã giảm giá
		SELECT 
			@DiscountPercent = DiscountPercent, 
			@EffectiveDate = EffectiveDate, 
			@ExpirationDate = ExpirationDate
		FROM Discount
		WHERE DiscountCode = @DiscountCode;

		-- Kiểm tra nếu mã giảm giá không tồn tại
		IF @DiscountPercent IS NULL
		BEGIN
			SET @IsSuccess = 0;
			PRINT 'Error: Discount code not found.';
			RETURN;
		END

		-- Kiểm tra ngày hiệu lực và hết hạn của mã giảm giá
		IF @EffectiveDate > GETDATE() OR @ExpirationDate < GETDATE()
		BEGIN
			SET @IsSuccess = 0;
			PRINT 'Error: Discount code is not valid at this time.';
			RETURN;
		END

		-- Tính toán giảm giá và tổng số tiền sau khi áp dụng
		DECLARE @OrderTotal DECIMAL(10,2);

		-- Lấy tổng giá trị đơn hàng từ bảng Orders (giả sử đã có cột TotalAmount trong bảng Orders)
		SELECT @OrderTotal = TotalAmount FROM Orders WHERE OrderID = @OrderID;

		-- Kiểm tra nếu đơn hàng không tồn tại
		IF @OrderTotal IS NULL
		BEGIN
			SET @IsSuccess = 0;
			PRINT 'Error: Order not found.';
			RETURN;
		END

		-- Tính số tiền giảm giá
		SET @AppliedDiscount = (@DiscountPercent / 100) * @OrderTotal;

		-- Tính tổng giá trị đơn hàng sau khi giảm giá
		SET @TotalAmount = @OrderTotal - @AppliedDiscount;

		-- Cập nhật giá trị đơn hàng với số tiền đã giảm
		UPDATE Orders
		SET TotalAmount = @TotalAmount
		WHERE OrderID = @OrderID;

		-- Đặt trạng thái thành công
		SET @IsSuccess = 1;
		PRINT 'Discount applied successfully.';
	END
	GO


CREATE OR ALTER PROCEDURE spUpdateDiscount
    @DiscountID INT,
    @DiscountCode NVARCHAR(50),
    @DiscountPercent DECIMAL(5,2),
    @EffectiveDate DATETIME = NULL,
    @ExpirationDate DATETIME = NULL,
    @CreatedBy NVARCHAR(50),
    @IsSuccess BIT OUTPUT    -- Để kiểm tra xem cập nhật mã giảm giá có thành công hay không
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra ngày hiệu lực và ngày hết hạn
    IF @EffectiveDate < GETDATE() 
    BEGIN
        SET @IsSuccess = 0;
        PRINT 'Error: Effective Date cannot be earlier than today.';
        RETURN;
    END

    IF @ExpirationDate < @EffectiveDate
    BEGIN
        SET @IsSuccess = 0;
        PRINT 'Error: Expiration Date cannot be earlier than Effective Date.';
        RETURN;
    END

    BEGIN TRY
        -- Bước 1: Cập nhật mã giảm giá trong bảng Discount
        UPDATE Discount
        SET 
            DiscountCode = @DiscountCode,
            DiscountPercent = @DiscountPercent,
            EffectiveDate = @EffectiveDate,
            ExpirationDate = @ExpirationDate,
            CreatedBy = @CreatedBy,
            CreateAt = GETDATE()  -- Nếu cần, cập nhật lại ngày tạo
        WHERE DiscountID = @DiscountID;

        -- Bước 2: Kiểm tra nếu có bản ghi được cập nhật
        IF @@ROWCOUNT = 0
        BEGIN
            SET @IsSuccess = 0;
            PRINT 'Error: DiscountID not found or update failed.';
            RETURN;
        END

        -- Bước 3: Nếu không có lỗi, đặt @IsSuccess = 1
        SET @IsSuccess = 1;
    END TRY
    BEGIN CATCH
        -- Bước 4: Xử lý lỗi, nếu có lỗi thì đặt @IsSuccess = 0
        SET @IsSuccess = 0;
    END CATCH
END
GO


create table productDiscount(
ProductID int,
DiscountID int,
AppliedDate datetime,
isActive bit default 1
foreign key (ProductID) references Products(ProductID),
foreign key (DiscountID) references Discount(DiscountID),
primary key(ProductID, DiscountID)
)

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2),
    OrderStatus NVARCHAR(50) DEFAULT N'Đang chờ lấy hàng' CHECK (OrderStatus IN (N'Đang chờ lấy hàng', N'Shipper đã nhận đơn hàng', N'Đang giao', N'Đã giao')),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


go




ALTER TABLE Orders
ADD ShippingAddress NVARCHAR(255),
    PhoneNumber NVARCHAR(20);
	go

ALTER TABLE Orders
ADD city NVARCHAR(255);
go

ALTER TABLE Orders
ADD province NVARCHAR(255);
go

ALTER TABLE Orders
ADD first_name NVARCHAR(255);
go

ALTER TABLE Orders
ADD last_name NVARCHAR(255);
go

ALTER TABLE Orders
ADD postal_code NVARCHAR(20);

go


CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    ProductID INT,
    Quantity INT,
    UnitPrice DECIMAL(10,2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);


create table PaymentMethod(
PaymentMethodID int primary key identity(1,1),
PaymentMethodName nvarchar(150),
isActive bit default 1
)

create table Payment(
PaymentID int primary key identity(1,1),
OrderID int,
Amount decimal(10,2),
Ship decimal(10,2) null,
TotalAmount decimal(10,2),
PaymentDate datetime default getdate(),
PaymentMethodID int,
PaymentStatus nvarchar(50) default 'Pending'check (PaymentStatus in ('Pending','Paid','Failed', 'Refunded')),
FailureReason Nvarchar(max),
foreign key (OrderID) references Orders(OrderID),
foreign key (PaymentMethodID) references PaymentMethod(PaymentMethodID)
)


create table PaymentDetails(
PaymentDetailID int primary key identity(1,1),
PaymentID int,
ProductID int,
Quantity int,
Price decimal(10,2)
foreign key (PaymentID) references Payment(PaymentID),
foreign key (ProductID) references Products(ProductID)
)

create table RefundMethods(
RefundMethodID int primary key identity(1,1),
RefundMethodName nvarchar(150),
isActive bit default 1
)

CREATE TABLE Refunds (
    RefundID INT PRIMARY KEY IDENTITY(1,1),
    PaymentID INT,
    RefundAmount DECIMAL(10,2),
    RefundDate DATETIME DEFAULT GETDATE(),
    RefundReason NVARCHAR(255),
    RefundMethodID INT,
    ProcessedByUserID INT,
    RefundStatus NVARCHAR(50) default 'Pending' check (RefundStatus in ('Pending','Refunded','Failed')),
    FOREIGN KEY (PaymentID) REFERENCES Payment(PaymentID),
    FOREIGN KEY (RefundMethodID) REFERENCES RefundMethods(RefundMethodID),
    FOREIGN KEY (ProcessedByUserID) REFERENCES Users(UserID)
);
GO


-- Feedback Table
CREATE TABLE Feedbacks (
    FeedbackID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT,
    UserID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5), 
    Comment NVARCHAR(1000),  
    FeedbackDate DATETIME,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

create table Inventory(
InventoryID int primary key identity(1,1),
ProductID int,
AccessoriesID int,
StockQuantity int,
DateAdded datetime default getdate(),
AddedBy nvarchar(50),
ModifiedBy nvarchar(50),
ModifiedDate datetime,
foreign key (ProductID) references Products(ProductID),
foreign key (AccessoriesID) references Accessories(AccessoriesID)
)

create table AccessoriesColors(
AccessoriesID int,
ColorID int,
foreign key (AccessoriesID) references Accessories(AccessoriesID),
foreign key (ColorID) references Colors(ColorID),
primary key (AccessoriesID,ColorID)
)

alter table Images
add AccessoriesID int;

alter table Images
Add constraint FK_Images_Accessories
Foreign key (AccessoriesID)
references Accessories(AccessoriesID);





Insert into ProductCategory(ProductCategoryName,Description,CreatedBy,ModifiedBy) values
('Leggings','Step into confidence and feel ready to push yourself','System','System'),
('T-Shirt',' These wardrobe essentials are all about keeping you comfy','System','System'),
('Sports Bras','No matter the workout, our sports bras have your back','System','System'),
('Short','Crafted to keep you cool and comfortable','System','System'),
('Hoodies','Get ready to work out in style with our womens gym hoodies','System','System'),
('Gym Jackets','Complete your activewear ensemble with our women s workout jackets','System','System'),
('Joggers','Update your workout wardrobe with a pair of our womens workout sweatpants','System','System'),
('Sweaters','Crafted to keep you cool and comfortable','System','System'),
('Vests','Crafted to keep you cool and comfortable','System','System'),
('Crop Tops','Crafted to keep you cool and comfortable','System','System'),
('Underwear & Basics','Crafted to keep you cool and comfortable','System','System'),
('High Waisted','Crafted to keep you cool and comfortable','System','System'),
('Seamless Leggings','Crafted to keep you cool and comfortable','System','System'),
('Scrunch Bum Leggings','Crafted to keep you cool and comfortable','System','System');



insert into Colors(ColorName) values
('Black'),
('Faded Blue'),

('Lido Green'),
('Pebble Grey'),

('Cargo Blue'),

('Muted Orange'),
('Base Green');

insert into Sizes(SizeName) values
('XXS'),
('XS'),
('S'),
('M'),
('L'),
('XL'),
('XXL');

insert into PaymentMethod(PaymentMethodName) values
('Cash'),
('Credit Card'),
('MOMO');

insert into RefundMethods(RefundMethodName) values
('Cash'),
('Credit Card'),
('MOMO');



insert into Products(ProductName,Description,Price,ProductCategoryID,ModifiedBy,Status) values
('Vital Seamless Leggings','DO IT ALL IN VITAL

From work to workout, you need your essentials to be able to do it all alongside you, which is why Vital’s sweat-wicking tech and seamless design is gonna tick all your boxes.

• Supportive ribbed waistband
• Sweat-wicking tech keeps you dry however you move
• Breathable mesh dots keep you cool
• Physique-shaping shades
• Seamless design for comfort & confidence

SIZE & FIT
• High-waisted fit
• Model is 5 8 and wears size XS

MATERIALS & CARE
• 93% Nylon, 7% Elastane
• Machine wash cold with the same or similar colours
• Don’t dry clean, iron, use fabric softeners or bleach

HOW IT’S MADE
• This product is made using dope dyeing technology that uses less water, energy and chemicals, as part of our sustainability strategy to lower environmental impact. Find out more about our sustainability goals here.

SKU: B1A2B-UCW7',58.50,6,'System','Available'),
('Lifting Dipped Waistband Leggings','DO IT ALL IN VITAL

From work to workout, you need your essentials to be able to do it all alongside you, which is why Vital’s sweat-wicking tech and seamless design is gonna tick all your boxes.

• Supportive ribbed waistband
• Sweat-wicking tech keeps you dry however you move
• Breathable mesh dots keep you cool
• Physique-shaping shades
• Seamless design for comfort & confidence

SIZE & FIT
• High-waisted fit
• Model is 5 8 and wears size XS

MATERIALS & CARE
• 93% Nylon, 7% Elastane
• Machine wash cold with the same or similar colours
• Don’t dry clean, iron, use fabric softeners or bleach

HOW IT’S MADE
• This product is made using dope dyeing technology that uses less water, energy and chemicals, as part of our sustainability strategy to lower environmental impact. Find out more about our sustainability goals here.

SKU: B1A2B-UCW7',65,6,'System','Available');




go




CREATE or alter PROCEDURE spDeleteProduct
    @ProductID INT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    -- Begin transaction to ensure data integrity
    BEGIN TRANSACTION

    BEGIN TRY
        -- Check if the product exists before attempting deletion
        IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
        BEGIN
            -- Delete the product from the Products table
            DELETE FROM Products
            WHERE ProductID = @ProductID;

            -- Set the output parameters for success
            SET @StatusCode = 0; -- 0 indicates success
            SET @Message = 'Product deleted successfully.';
        END
        ELSE
        BEGIN
            -- Set the output parameters for failure (product not found)
            SET @StatusCode = 1; -- 1 indicates failure
            SET @Message = 'Product not found.';
        END

        -- Commit the transaction if everything is successful
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction if an error occurs
        ROLLBACK TRANSACTION;

        -- Set the output parameters for an error
        SET @StatusCode = 2; -- 2 indicates error
        SET @Message = ERROR_MESSAGE();
        
        -- Return the error to the calling process
        THROW;
    END CATCH
END;

go





create or alter procedure spRegisterUser
@Email nvarchar(100),
@firstname nvarchar(50),
@lastname nvarchar(50),
@PasswordHash nvarchar(255),
@CreatedBy nvarchar(100),
@UserID int output,
@VerificationToken NVARCHAR(255) OUTPUT,
@ErrorMessage nvarchar(255) output
as
begin 

set nocount on;
begin try

IF @Email is null or @PasswordHash is null or @FirstName is null or @LastName is null
begin
set @ErrorMessage = N'Email, m?t kh?u,h? và tên không d? tr?ng';
set @UserID =-1;
return;
end

if exists(select 1 from Users where Email =@Email)
begin
set @ErrorMessage =N'Email này dã t?n t?i';
set @UserID =-1;
return;
end

if len(@PasswordHash) <8
begin
set @ErrorMessage =N'Password ph?i có ít nh?t 8 ký t?';
set @UserID =-1;
return;
end

if @PasswordHash not like '%[A-Z]%'
begin
set @ErrorMessage =N'M?t kh?u ph?i ch?a ít nh?t 1 ký t? hoa';
set @UserID =-1;
return;
end

if @PasswordHash not like '%[0-9]%'
begin 
set @ErrorMessage = N'M?t kh?u ph?i ch?a ít nh?t 1 ch? s?';
set @UserID =-1;
return;
end

-- Sinh Verification Token ngẫu nhiên
        SET @VerificationToken = NEWID();

declare @DefaultRoleID int =2;
begin transaction
--insert into Users(RoleID,firstname,lastname,Email,PasswordHash,CreatedBy,CreatedDate)
--values (@DefaultRoleID,@firstname,@lastname,@Email,@PasswordHash,@CreatedBy,GETDATE());
INSERT INTO Users (RoleID, firstname, lastname, Email, PasswordHash, CreatedBy, CreatedDate, EmailVerified, VerificationToken, VerificationTokenExpiry)
        VALUES (@DefaultRoleID, @firstname, @lastname, @Email, @PasswordHash, @CreatedBy, GETDATE(), 0, @VerificationToken, DATEADD(HOUR, 24, GETDATE()));
set @UserID = SCOPE_IDENTITY();
set @ErrorMessage =null;
commit transaction
end try

begin catch
rollback transaction
set @ErrorMessage = ERROR_MESSAGE();
set @UserID =-1;
end catch
end;
go


CREATE OR ALTER PROCEDURE spVerifyEmail
    @Token NVARCHAR(255),
    @Result BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @UserID INT, @TokenExpiry DATETIME;

    -- Kiểm tra token có tồn tại và còn hiệu lực không
    SELECT @UserID = UserID, @TokenExpiry = VerificationTokenExpiry
    FROM Users
    WHERE VerificationToken = @Token AND EmailVerified = 0;

    IF @UserID IS NULL
    BEGIN
        SET @Result = 0; -- Token không hợp lệ
        RETURN;
    END

    -- Kiểm tra token đã hết hạn chưa
    IF @TokenExpiry < GETDATE()
    BEGIN
        SET @Result = 0; -- Token đã hết hạn
        RETURN;
    END

    -- Cập nhật trạng thái xác minh email
    UPDATE Users
    SET EmailVerified = 1, VerificationToken = NULL, VerificationTokenExpiry = NULL
    WHERE UserID = @UserID;

    SET @Result = 1; -- Thành công
END;
go



--Phân quy?n user
create or alter procedure spAssignUserRole
@UserID int,
@RoleID int,
@ErrorMessage nvarchar(255) output
as 
begin

set nocount on;
begin try

if not exists(select 1 from Users where UserID = @UserID)
begin
set @ErrorMessage = N'Ngu?i dùng không t?n t?i';
return;
end

if not exists(select 1 from UserRoles where RoleID = @RoleID)
begin
set @ErrorMessage=N'V? trí này không t?n t?i';
return;
end

begin transaction
update Users set RoleID =@RoleID where userID =@UserID;
commit transaction
set @ErrorMessage =null;
end try

begin catch
rollback transaction
set @ErrorMessage = ERROR_MESSAGE();
end catch
end;
go


create or alter procedure spListAllUsers
@IsActive bit =null
as
begin
set nocount on;

if @isActive is null
begin
select u.UserID,u.Email,u.firstname,u.lastname,r.RoleName,u.isActive,u.LastLogin,u.CreatedBy,u.CreatedDate from Users u
inner join UserRoles r on u.RoleID = r.RoleID;
end
else
begin
select 
u.UserID,u.Email,u.firstname,u.lastname,r.RoleName,u.isActive,u.LastLogin,u.CreatedBy,u.CreatedDate from Users u
inner join
UserRoles r on u.RoleID = r.RoleID
where u.isActive = @isActive;
end
end;
go



create or alter procedure spGetUserByID
@UserID int,
@ErrorMessage nvarchar(255) output
as
begin
set nocount on;

if not exists (select 1 from Users where userID =@UserID)
begin	
set @ErrorMessage =N'User không tìm th?y';
return;
end

select u.UserID,u.Email,u.firstname,u.lastname,r.RoleName,u.isActive,u.LastLogin,u.CreatedBy,u.CreatedDate from Users u
inner join 
UserRoles r on u.RoleID = r.RoleID
where u.userID = @UserID;
set	 @ErrorMessage =null;

end;
go


--C?p nh?t thông tin user
create or alter procedure spUpdateUser
@UserID int,
@Email nvarchar(100)		,
@firstname nvarchar(50),
@lastname nvarchar(50),
@PasswordHash nvarchar(100),
@ModifiedBy nvarchar(100),
@ErrorMessage nvarchar(255) output
as
begin
set nocount on;
begin try
if not exists( select 1 from Users where UserID = @UserID)
begin
set @ErrorMessage =N'User không tìm th?y';
return;
end
if exists (select 1 from Users where Email = @Email and userID <>@UserID)
begin
set @ErrorMessage=N'Email này dã du?c dùng b?i 1 ngu?i khác';
return;
end

begin transaction
update Users
set Email =@Email,firstname = @firstname,lastname=@lastname, PasswordHash = @PasswordHash, ModifiedBy =@ModifiedBy,ModifiedDate =GETDATE()
where userID = @UserID;
commit transaction
set @ErrorMessage =null;
end try
begin catch
rollback transaction 
set @ErrorMessage = ERROR_MESSAGE();
end catch
end;
go

CREATE or alter PROCEDURE spToggleActive
    @isActive BIT,
    @UserID INT,
    @ErrorMessage NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;  -- Prevents extra result sets from interfering with SELECT statements

    BEGIN TRY
        -- Check if the user exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
        BEGIN
            SET @ErrorMessage = N'User không tìm th?y';  -- Change message to Vietnamese for clarity
            RETURN;  -- Exit the procedure if the user doesn't exist
        END

        BEGIN TRANSACTION;  -- Start transaction

        -- Update the user's active status
        UPDATE Users SET IsActive = @isActive WHERE UserID = @UserID;

        COMMIT TRANSACTION;  -- Commit the transaction

        SET @ErrorMessage = NULL;  -- Clear the error message if successful
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;  -- Rollback transaction on error
        SET @ErrorMessage = ERROR_MESSAGE();  -- Get the error message
    END CATCH
END;
GO


--Dang nhap

CREATE or alter PROCEDURE spLoginUser
    @Email NVARCHAR(100),
    @PasswordHash NVARCHAR(255) OUTPUT,
    @UserID INT OUTPUT,
    @RoleID INT OUTPUT, -- Thêm biến đầu ra cho RoleID
    @ErrorMessage NVARCHAR(255) OUTPUT
AS
BEGIN
    -- Lấy UserID, PasswordHash và RoleID dựa trên Email
    SELECT @UserID = userID, @PasswordHash = PasswordHash, @RoleID = RoleID 
    FROM Users 
    WHERE Email = @Email;

    IF @UserID IS NOT NULL
    BEGIN
        -- Kiểm tra nếu tài khoản đang hoạt động
        IF EXISTS (SELECT 1 FROM Users WHERE userID = @UserID AND IsActive = 1)
        BEGIN
            -- Cập nhật LastLogin cho người dùng
            UPDATE Users 
            SET LastLogin = GETDATE() 
            WHERE userID = @UserID;
            
            SET @ErrorMessage = NULL; -- Xóa thông báo lỗi cũ
        END
        ELSE
        BEGIN
            -- Nếu tài khoản không hoạt động
            SET @ErrorMessage = 'Tài khoản của bạn bị vô hiệu hóa';
            SET @UserID = NULL; -- Reset UserID vì đăng nhập không thành công
            SET @RoleID = NULL; -- Reset RoleID
        END
    END
    ELSE
    BEGIN
        -- Nếu thông tin đăng nhập không đúng
        SET @ErrorMessage = 'Thông tin không hợp lệ';
        SET @RoleID = NULL; -- Reset RoleID nếu đăng nhập không thành công
    END
END;
GO



create or alter procedure spCreateProductCatogry
@ProductCategoryName nvarchar(100),
@Description nvarchar(100),
@CreatedBy nvarchar(100),
@Message nvarchar(255) output,
@ProductCategoryID int output,
@StatusCode int output

as
begin

set nocount on;
begin try
begin transaction
if not exists (select 1 from ProductCategory where ProductCategoryName =@ProductCategoryName)
begin
   insert into ProductCategory(ProductCategoryName,Description,CreatedBy,CreatedDate)
   values (@ProductCategoryName, @Description,@CreatedBy, getdate())

   set @ProductCategoryID = SCOPE_IDENTITY()
   set @StatusCode =0
   set @Message = N'Tao ProductCategory thanh cong'

  end
else
begin
    set @StatusCode = 1
	set @Message = N'ProductCategory da ton tai roi, dien cai ten khac'
	end

commit transaction
end try
begin catch
rollback transaction
set @StatusCode = ERROR_NUMBER()
set @Message = ERROR_MESSAGE()
end catch
end
go



create or alter procedure spUpdateProductCategory

@ProductCategoryID int,
@ProductCategoryName nvarchar(100),
@Description nvarchar(100),
@ModifiedBy nvarchar(100),
@StatusCode int output,
@Message nvarchar(255) output

as 
begin 
set nocount on
begin try
begin transaction
if not exists (select 1 from ProductCategory where ProductCategoryName = @ProductCategoryName and ProductCategoryID <> @ProductCategoryID)
begin
if exists (select 1 from ProductCategory where ProductCategoryID = @ProductCategoryID)
begin 
update ProductCategory
set ProductCategoryName = @ProductCategoryName,
  Description = @Description,
  ModifiedBy  = @ModifiedBy,
  ModifiedDate = getdate()
  where ProductCategoryID = @ProductCategoryID
  

  set @StatusCode =0
  set @Message = 'Cap nhat productCategory thanh cong'
  end
  else
  begin
  set @StatusCode = 2
  set @Message = 'Khong tim thay productCategoty'
  end
  end
  else
  begin
  set @StatusCode = 1
  set @Message = 'Mot kieu productCategory khac trung ten'

  end
  commit transaction
  end try
  begin catch
  rollback transaction
  set @StatusCode = ERROR_NUMBER()
  set @Message = ERROR_MESSAGE()
  end catch
  end
  go


create or alter procedure spDeleteProductCategory
  @ProductCategoryID int,
  @StatusCode int output,
  @Message nvarchar(255) output
as
begin
  set nocount on;
  begin try
    begin transaction;

    -- First check if the category exists
    if exists (select 1 from ProductCategory where ProductCategoryID = @ProductCategoryID)
    begin
      -- Check if there are products linked to the category
      if not exists (select 1 from Products where ProductCategoryID = @ProductCategoryID)
      begin
        -- Delete the category if no products are linked
        delete from ProductCategory where ProductCategoryID = @ProductCategoryID;
        set @StatusCode = 0; -- Success
        set @Message = 'Xoa productcategory thanh cong'; 
      end
      else
      begin
        set @StatusCode = 1; -- Cannot delete due to existing products
        set @Message = 'Khong xoa duoc boi vi no dinh toi lien ket 1 san pham trong bang product'; -- Message for existing products
      end
    end
    else
    begin
      set @StatusCode = 2; -- Category not found
      set @Message = 'Khong tim thay id productcategory'; -- Message for not found
    end
    
    commit transaction;
  end try
  begin catch
    rollback transaction;
    set @StatusCode = ERROR_NUMBER();
    set @Message = ERROR_MESSAGE();
  end catch
end
go




CREATE or alter PROCEDURE spGetAllProductCategory
@IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @IsActive IS NULL
    BEGIN
        SELECT ProductCategoryID, ProductCategoryName, Description, isActive 
        FROM ProductCategory;
    END
    ELSE
    BEGIN
        SELECT ProductCategoryID, ProductCategoryName, Description, isActive 
        FROM ProductCategory 
        WHERE isActive = @IsActive;
    END
END
GO


create or alter procedure spGetProductCategoryByID
@ProductCategoryID int
as
begin

set nocount on
select ProductCategoryID, ProductCategoryName,Description,isActive from ProductCategory where ProductCategoryID = @ProductCategoryID
end
go


CREATE OR ALTER PROCEDURE spToggleProductCategoryActive
    @ProductCategoryID INT,
    @IsActive BIT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if the ProductCategory exists
        IF NOT EXISTS (SELECT 1 FROM ProductCategory WHERE ProductCategoryID = @ProductCategoryID)
        BEGIN
            -- Set StatusCode and Message if ProductCategory does not exist
            SET @StatusCode = 1;
            SET @Message = 'Không tìm thấy ProductCategory';
            RETURN;
        END

        -- Begin transaction
        BEGIN TRANSACTION;

        -- Update the ProductCategory active status
        UPDATE ProductCategory
        SET isActive = @IsActive
        WHERE ProductCategoryID = @ProductCategoryID;

        -- Set the success status and message
        SET @StatusCode = 0;
        SET @Message = 'ProductCategory activated/deactivated successfully';

        -- Commit the transaction
        COMMIT TRANSACTION;
    
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of an error
        ROLLBACK TRANSACTION;
        
        -- Set StatusCode and Message based on the error
        SET @StatusCode = ERROR_NUMBER();
        SET @Message = ERROR_MESSAGE();
    END CATCH
END;

go



	CREATE or alter PROCEDURE spGetUserRoles
	AS
	BEGIN
		SET NOCOUNT ON;

		SELECT RoleID, RoleName FROM UserRoles; -- Thay ??i tên b?ng n?u c?n
	END;
	GO




--Tao san pham
CREATE OR ALTER PROCEDURE spCreateProduct
    @ProductID int output,
    @ProductName nvarchar(150),
	@Description nvarchar(max),
	@ProductCategoryID int,
    @Price DECIMAL(10,2),
    @Status NVARCHAR(50),
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            -- Kiem tra neu ton tai productcategory 
            IF EXISTS (SELECT 1 FROM ProductCategory WHERE ProductCategoryID = @ProductCategoryID)
            BEGIN
                -- Ensure the room number is unique
                IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductName = @ProductName)
                BEGIN
                    INSERT INTO Products (ProductName,ProductCategoryID, Description, Price, Status)
                    VALUES (@ProductName,@ProductCategoryID,  @Description, @Price, @Status)
                    SET @ProductID = SCOPE_IDENTITY()
                    SET @StatusCode = 0 -- Success
                    SET @Message = 'Tao san pham thanh cong'
                END
                ELSE
                BEGIN
                    SET @StatusCode = 1 
                    SET @Message = 'Trung ten san pham'
                END
            END
            ELSE
            BEGIN
                SET @StatusCode = 3 
                SET @Message = 'ProductCategoryID khong hop le'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER()
        SET @Message = ERROR_MESSAGE()
    END CATCH
END
GO





-- Update san pham
CREATE OR ALTER PROCEDURE spUpdateProduct
    @ProductID INT,
    @ProductName NVARCHAR(150),
    @Description nvarchar(max),
	@ProductCategoryID int,
    @Price DECIMAL(10,2),
    @isActive bit,
    @Status NVARCHAR(50),
    @ModifiedBy NVARCHAR(100),
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            -- Check if the productID is valid and room number is unique for other rooms
            IF EXISTS (SELECT 1 FROM ProductCategory WHERE ProductCategoryID = @ProductCategoryID) AND
               NOT EXISTS (SELECT 1 FROM Products WHERE ProductName = @ProductName AND ProductID <> @ProductID)
            BEGIN
                -- Verify the product exists before updating
                IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
                BEGIN
                    UPDATE Products
                    SET
					    ProductName = @ProductName,
                        ProductCategoryID = @ProductCategoryID,
						Description =@Description,
						isActive = @isActive,
                        Price = @Price,
                        Status = @Status,              
                        ModifiedBy = @ModifiedBy,
                        ModifiedDate = GETDATE()
                    WHERE ProductID = @ProductID
                    SET @StatusCode = 0 -- Success
                    SET @Message = 'Product updated successfully.'
                END
                ELSE
                BEGIN
                    SET @StatusCode = 2 -- Failure due to room not found
                    SET @Message = 'Product not found.'
                END
            END
            ELSE
            BEGIN
                SET @StatusCode = 1 -- Failure due to invalid RoomTypeID or duplicate room number
                SET @Message = 'ProductCategoryID invalid hoac duplicate'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER()
        SET @Message = ERROR_MESSAGE()
    END CATCH
END
GO



-- Delete product

CREATE OR ALTER PROCEDURE spDeleteProduct
    @ProductID INT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            -- Ensure no active payments exist for the product (excluding failed or refunded payments)
            IF NOT EXISTS (
                SELECT 1 
                FROM PaymentDetails PD
                JOIN Payment P ON PD.PaymentID = P.PaymentID
                WHERE PD.ProductID = @ProductID 
                AND P.PaymentStatus NOT IN ('Refunded', 'Failed')
            )
            BEGIN
                -- Verify the product exists and is currently active before deactivating
                IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID AND isActive = 1)
                BEGIN
                    -- Instead of deleting, we update the isActive flag to false
                    UPDATE Products
                    SET isActive = 0  -- Set isActive to false to indicate the product is no longer active
                    WHERE ProductID = @ProductID
                    SET @StatusCode = 0 -- Success
                    SET @Message = 'Product deactivated successfully.'
                END
                ELSE
                BEGIN
                    SET @StatusCode = 2 -- Failure due to product not found or already deactivated
                    SET @Message = 'Product not found or already deactivated.'
                END
            END
            ELSE
            BEGIN
                SET @StatusCode = 1 -- Failure due to active payments
                SET @Message = 'Product cannot be deactivated, there are active payments.'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER()
        SET @Message = ERROR_MESSAGE()
    END CATCH
END
GO





-- Get ProductByID
CREATE OR ALTER PROCEDURE spGetProductByID
    @ProductID INT
AS
BEGIN
    SELECT u.ProductID, u.ProductName, u.Description, u.Price, u.isActive,r.ProductCategoryName , u.Status,u.ModifiedDate  FROM Products u inner join ProductCategory r on u.ProductCategoryID = r.ProductCategoryID
	WHERE u.ProductID = @ProductID
	
END
GO



CREATE OR ALTER PROCEDURE spGetAllProducts
    @ProductCategoryID INT = NULL,     -- Optional filter by Product Category
    @Status NVARCHAR(50) = NULL        -- Optional filter by Status
AS
BEGIN
    SET NOCOUNT ON;

    SELECT p.ProductID, 
           p.ProductName, 
           p.Description, 
           p.Price, 
           p.Status, 
           p.isActive, 
           p.ModifiedDate, 
           c.ProductCategoryName 
    FROM Products p
    INNER JOIN ProductCategory c ON p.ProductCategoryID = c.ProductCategoryID
    WHERE (@ProductCategoryID IS NULL OR p.ProductCategoryID = @ProductCategoryID)
      AND (@Status IS NULL OR p.Status = @Status);
END
GO





create or alter procedure spToggleProductActive
@ProductID int,
@isActive bit,
@StatusCode int output,
@Message nvarchar(255) output
as
begin
set nocount on;
begin try

if not exists (select 1 from Products where ProductID = @ProductID)
begin
      set @StatusCode =1
	  set @Message = 'Khong thay product'
	  end
begin transaction
update Products set isActive = @IsActive where ProductID = @ProductID;
set @StatusCode =0
set @Message = 'ProductCategoryID activated/deactivated successfully'
commit transaction	

end try
begin catch
rollback transaction
set @StatusCode = ERROR_NUMBER()
set @Message = Error_Message()
end catch
end;	
go



	GO



-- Create Room Type
CREATE or alter PROCEDURE spCreateSizeType
    @SizeName NVARCHAR(50),
    @SizeID INT OUTPUT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            IF NOT EXISTS (SELECT 1 FROM Sizes WHERE SizeName = @SizeName)
            BEGIN
                INSERT INTO Sizes (SizeName)
                VALUES (@SizeName)

                SET @SizeID = SCOPE_IDENTITY()
                SET @StatusCode = 0 -- Success
                SET @Message = 'Size type created successfully.'
            END
            ELSE
            BEGIN
                SET @StatusCode = 1 -- Failure due to duplicate name
                SET @Message = 'Size type name already exists.'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER() -- SQL Server error number
        SET @Message = ERROR_MESSAGE()
    END CATCH
END
GO

CREATE or alter PROCEDURE spUpdateSizeType
    @SizeID INT,
    @SizeName NVARCHAR(50),
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            -- Ki?m tra xem tên m?i ?ã t?n t?i trong m?t b?n ghi khác ch?a
            IF NOT EXISTS (SELECT 1 FROM Sizes WHERE SizeName = @SizeName AND SizeID <> @SizeID)
            BEGIN
                -- Ki?m tra SizeID có t?n t?i không
                IF EXISTS (SELECT 1 FROM Sizes WHERE SizeID = @SizeID)
                BEGIN
                    UPDATE Sizes
                    SET SizeName = @SizeName
                    WHERE SizeID = @SizeID

                    SET @StatusCode = 0 -- Thành công
                    SET @Message = N'C?p nh?t kích th??c thành công.'
                END
                ELSE
                BEGIN
                    SET @StatusCode = 2 -- Không tìm th?y kích th??c
                    SET @Message = 'Kích th??c không tìm th?y.'
                END
            END
            ELSE
            BEGIN
                SET @StatusCode = 1 -- Tên trùng l?p
                SET @Message = 'M?t kích th??c khác v?i tên này ?ã t?n t?i.'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER() -- Mã l?i SQL Server
        SET @Message = ERROR_MESSAGE() -- Thông báo l?i SQL
    END CATCH
END
GO


-- Delete Room Type By Id
CREATE or alter PROCEDURE spDeleteSizeType
    @SizeID INT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
   
            -- Check for existing rooms linked to this room type
            IF NOT EXISTS (SELECT 1 FROM ProductSizes WHERE SizeID = @SizeID)
            BEGIN
                IF EXISTS (SELECT 1 FROM Sizes WHERE SizeID = @SizeID)
                BEGIN
                    DELETE FROM Sizes WHERE SizeID = @SizeID
                    SET @StatusCode = 0 -- Success
                    SET @Message = 'Size type deleted successfully.'
                END
                ELSE
                BEGIN
                    SET @StatusCode = 2 -- Failure due to not found
                    SET @Message = 'Size type not found.'
                END
            END
            ELSE
            BEGIN
                SET @StatusCode = 1 -- Failure due to dependency
                SET @Message = 'Cannot delete size type as it is being referenced by one or more rooms.'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER() -- SQL Server error number
        SET @Message = ERROR_MESSAGE()
    END CATCH
END
GO

CREATE or alter PROCEDURE spGetSizeTypeById
    @SizeID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT SizeID, SizeName, IsActive 
    FROM Sizes 
    WHERE SizeID = @SizeID;
END
GO



CREATE  or alter PROCEDURE spGetAllSizeTypes
 @isActive BIT = NULL  -- Optional parameter to filter by IsActive status
AS
BEGIN
    SET NOCOUNT ON;
    -- Select users based on active status
    IF @isActive IS NULL
    BEGIN
        SELECT SizeID, SizeName, isActive FROM Sizes
    END
    ELSE
    BEGIN
        SELECT SizeID, SizeName, isActive FROM Sizes WHERE isActive = @isActive;
    END
END
GO

-- Activate/Deactivate RoomType
CREATE or alter PROCEDURE spToggleSizeTypeActive
    @SizeID INT,
    @isActive BIT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check user existence
        IF NOT EXISTS (SELECT 1 FROM Sizes WHERE SizeID = @SizeID)
        BEGIN
             SET @StatusCode = 1 -- Failure due to not found
             SET @Message = 'Size type not found.'
        END

        -- Update IsActive status
        BEGIN TRANSACTION
             UPDATE Sizes SET isActive = @isActive WHERE SizeID = @SizeID;
                SET @StatusCode = 0 -- Success
             SET @Message = 'Size type activated/deactivated successfully.'
        COMMIT TRANSACTION

    END TRY
    -- Handle exceptions
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER() -- SQL Server error number
        SET @Message = ERROR_MESSAGE()
    END CATCH
END;
GO




--Tao create color

-- Create Room Type
CREATE or alter PROCEDURE spCreateColorType
    @ColorName NVARCHAR(50),
    @ColorID INT OUTPUT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            IF NOT EXISTS (SELECT 1 FROM Colors WHERE ColorName = @ColorName)
            BEGIN
                INSERT INTO Colors (ColorName)
                VALUES (@ColorName)

                SET @ColorID = SCOPE_IDENTITY()
                SET @StatusCode = 0 -- Success
                SET @Message = 'Color type created successfully.'
            END
            ELSE
            BEGIN
                SET @StatusCode = 1 -- Failure due to duplicate name
                SET @Message = 'Size type name already exists.'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER() -- SQL Server error number
        SET @Message = ERROR_MESSAGE()
    END CATCH
END
GO

CREATE or alter PROCEDURE spUpdateColorType
    @ColorID INT,
    @ColorName NVARCHAR(50),
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            -- Ki?m tra xem tên m?i ?ã t?n t?i trong m?t b?n ghi khác ch?a
            IF NOT EXISTS (SELECT 1 FROM Colors WHERE ColorName = @ColorName AND ColorID <> @ColorID)
            BEGIN
                -- Ki?m tra SizeID có t?n t?i không
                IF EXISTS (SELECT 1 FROM Colors WHERE ColorID = @ColorID)
                BEGIN
                    UPDATE Colors
                    SET ColorName = @ColorName
                    WHERE ColorID = @ColorID

                    SET @StatusCode = 0 -- Thành công
                    SET @Message = N'C?p nh?t color thành công.'
                END
                ELSE
                BEGIN
                    SET @StatusCode = 2 -- Không tìm th?y kích th??c
                    SET @Message = N' Color không tìm th?y.'
                END
            END
            ELSE
            BEGIN
                SET @StatusCode = 1 -- Tên trùng l?p
                SET @Message = 'M?t kích th??c khác v?i tên này ?ã t?n t?i.'
            END
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER() -- Mã l?i SQL Server
        SET @Message = ERROR_MESSAGE() -- Thông báo l?i SQL
    END CATCH
END
GO


-- Delete Room Type By Id
CREATE OR ALTER PROCEDURE spDeleteColorType
    @ColorID INT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

            -- Check if the color is being referenced in the ProductColors table
            IF EXISTS (SELECT 1 FROM ProductColors WHERE ColorID = @ColorID)
            BEGIN
                SET @StatusCode = 1; -- Dependency error
                SET @Message = 'Cannot delete the color as it is being referenced by one or more products.';
            END
            ELSE
            BEGIN
                -- Check if the color exists in the Colors table
                IF EXISTS (SELECT 1 FROM Colors WHERE ColorID = @ColorID)
                BEGIN
                    DELETE FROM Colors WHERE ColorID = @ColorID;

                    SET @StatusCode = 0; -- Success
                    SET @Message = 'Color deleted successfully.';
                END
                ELSE
                BEGIN
                    SET @StatusCode = 2; -- Not found
                    SET @Message = 'Color not found.';
                END
            END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Set output parameters with the error information
        SET @StatusCode = ERROR_NUMBER(); -- SQL Server error number
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;

GO

CREATE or alter PROCEDURE spGetColorTypeById
    @ColorID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ColorID, ColorName, isActive 
    FROM Colors 
    WHERE ColorID = @ColorID;
END
GO



CREATE PROCEDURE spGetAllColorTypes
 @isActive BIT = NULL  -- Optional parameter to filter by IsActive status
AS
BEGIN
    SET NOCOUNT ON;
    -- Select users based on active status
    IF @isActive IS NULL
    BEGIN
        SELECT ColorID, ColorName, isActive FROM Colors
    END
    ELSE
    BEGIN
        SELECT ColorID, ColorName, isActive FROM Colors WHERE isActive = @isActive;
    END
END
GO

-- Activate/Deactivate RoomType
CREATE PROCEDURE spToggleColorTypeActive
    @ColorID INT,
    @isActive BIT,
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check user existence
        IF NOT EXISTS (SELECT 1 FROM Colors WHERE ColorID = @ColorID)
        BEGIN
             SET @StatusCode = 1 -- Failure due to not found
             SET @Message = 'Color type not found.'
        END

        -- Update IsActive status
        BEGIN TRANSACTION
             UPDATE Colors SET isActive = @isActive WHERE ColorID = @ColorID;
                SET @StatusCode = 0 -- Success
             SET @Message = 'Color type activated/deactivated successfully.'
        COMMIT TRANSACTION

    END TRY
    -- Handle exceptions
    BEGIN CATCH
        ROLLBACK TRANSACTION
        SET @StatusCode = ERROR_NUMBER() -- SQL Server error number
        SET @Message = ERROR_MESSAGE()
    END CATCH
END;
GO




--Procedure quan ly productSize

CREATE OR ALTER PROCEDURE spFetchProductSizeBySizeID
    @SizeID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT a.ProductID, a.ProductName, a.ProductCategoryID,a.Description,a.Price ,a.IsActive
 FROM ProductSizes ra
 JOIN Products a ON ra.ProductID = a.ProductID
 WHERE ra.SizeID = @SizeID;
END;
GO


CREATE PROCEDURE spGetAllProductSize
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.ProductName,
        b.SizeName, 
        ra.ProductID, 
        ra.SizeID 
    FROM 
        ProductSizes ra
    JOIN 
        Products a ON ra.ProductID = a.ProductID
    JOIN 
        Sizes b ON ra.SizeID = b.SizeID;  -- Corrected the join to use SizeID
END
GO






CREATE OR ALTER PROCEDURE spAddProductSizes
    @ProductID INT,
    @SizeID INT,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID) OR
               NOT EXISTS (SELECT 1 FROM Sizes WHERE SizeID = @SizeID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'ProductID or SizeID does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            IF EXISTS (SELECT 1 FROM ProductSizes WHERE ProductID = @ProductID AND SizeID = @SizeID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'This productSize link already exists.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            INSERT INTO ProductSizes(ProductID, SizeID)
            VALUES (@ProductID, @SizeID);
            SET @Status = 1; -- Success
            SET @Message = 'ProductSize added successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO


-- Deleting a Single ProductSize based on ProductID and SizeID
CREATE OR ALTER PROCEDURE spDeleteSingleProductSize
    @ProductID INT,
    @SizeID INT,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            DECLARE @Exists BIT;
            SELECT @Exists = COUNT(*) FROM ProductSizes WHERE ProductID = @ProductID AND SizeID = @SizeID;
            IF @Exists = 0
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'The specified ProductID and SizeID combination does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            -- Delete the specified room amenity
            DELETE FROM ProductSizes
            WHERE ProductID = @ProductID AND SizeID = @SizeID;
            SET @Status = 1; -- Success
            SET @Message = 'ProductSize deleted successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO


-- Create a User-Defined Table Type
-- This type will be used to pass multiple Size IDs as a single parameter to the stored procedures.
CREATE TYPE SizeIDTableType AS TABLE (SizeID INT);
GO


--luu tru mot loat size cho san pham

CREATE OR ALTER PROCEDURE spBulkInsertProductSize
    @ProductID INT,
    @SizeIDs SizeIDTableType READONLY,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            -- Check if the RoomTypeID exists
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'ProductID does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            -- Check if all AmenityIDs exist
            IF EXISTS (SELECT 1 FROM @SizeIDs WHERE SizeID NOT IN (SELECT SizeID FROM Sizes))
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'One or more Size do not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            -- Insert AmenityIDs that do not already exist for the given RoomTypeID
            INSERT INTO ProductSizes(ProductID, SizeID)
            SELECT @ProductID, a.SizeID 
            FROM @SizeIDs a
            WHERE NOT EXISTS (
                SELECT 1 
                FROM ProductSizes ra
                WHERE ra.ProductID = @ProductID AND ra.SizeID = a.SizeID
            );
            SET @Status = 1; -- Success
            SET @Message = 'ProductSize added successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO


CREATE OR ALTER PROCEDURE spBulkUpdateProductSizes
    @ProductID INT,
    @SizeIDs SizeIDTableType READONLY,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'Product does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            DECLARE @Count INT;
            SELECT @Count = COUNT(*) FROM Sizes WHERE SizeID IN (SELECT SizeID FROM @SizeIDs);
            IF @Count <> (SELECT COUNT(*) FROM @SizeIDs)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'One or more size do not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            DELETE FROM ProductSizes WHERE ProductID = @ProductID;
            INSERT INTO ProductSizes(ProductID, SizeID)
            SELECT @ProductID, SizeID FROM @SizeIDs;
            SET @Status = 1; -- Success
            SET @Message = 'ProductSizes updated successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO
	


-- Deleting All ProductSize of a Single ProductID
CREATE OR ALTER PROCEDURE spDeleteAllProductSizeByProductID
    @ProductID INT,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            -- Delete all amenities for the specified room type
            DELETE FROM ProductSizes WHERE ProductID = @ProductID;
            SET @Status = 1; -- Success
            SET @Message = 'All Sizes for the Product have been deleted successfully.';
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO

---------------------------------------312312313123123







CREATE OR ALTER PROCEDURE spFetchProductColorByColorID
    @ColorID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT a.ProductID, a.ProductName, a.ProductCategoryID,a.Description,a.Price ,a.IsActive
 FROM ProductColors ra
 JOIN Products a ON ra.ProductID = a.ProductID
 WHERE ra.ColorID = @ColorID;
END;
GO


CREATE PROCEDURE spGetAllProductColor
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.ProductName,
        b.ColorName, 
        ra.ProductID, 
        ra.ColorID 
    FROM 
        ProductColors ra
    JOIN 
        Products a ON ra.ProductID = a.ProductID
    JOIN 
        Colors b ON ra.ColorID = b.ColorID;  -- Corrected the join to use SizeID
END
GO









CREATE OR ALTER PROCEDURE spAddProductColors
    @ProductID INT,
    @ColorID INT,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID) OR
               NOT EXISTS (SELECT 1 FROM Colors WHERE ColorID = @ColorID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'ProductID or ColorID does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            IF EXISTS (SELECT 1 FROM ProductColors WHERE ProductID = @ProductID AND ColorID = @ColorID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'This productColor link already exists.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            INSERT INTO ProductColors(ProductID, ColorID)
            VALUES (@ProductID, @ColorID);
            SET @Status = 1; -- Success
            SET @Message = 'ProductColor added successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO


-- Deleting a Single ProductSize based on ProductID and SizeID
CREATE OR ALTER PROCEDURE spDeleteSingleProductColor
    @ProductID INT,
    @ColorID INT,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            DECLARE @Exists BIT;
            SELECT @Exists = COUNT(*) FROM ProductColors WHERE ProductID = @ProductID AND ColorID = @ColorID;
            IF @Exists = 0
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'The specified ProductID and ColorID combination does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            -- Delete the specified room amenity
            DELETE FROM ProductColors
            WHERE ProductID = @ProductID AND ColorID = @ColorID;
            SET @Status = 1; -- Success
            SET @Message = 'ProductColor deleted successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO


-- Create a User-Defined Table Type
-- This type will be used to pass multiple Size IDs as a single parameter to the stored procedures.
CREATE TYPE ColorIDTableType AS TABLE (ColorID INT);
GO


--luu tru mot loat size cho san pham

CREATE OR ALTER PROCEDURE spBulkInsertProductColor
    @ProductID INT,
    @ColorIDs ColorIDTableType READONLY,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            -- Check if the RoomTypeID exists
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'ProductID does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            -- Check if all AmenityIDs exist
            IF EXISTS (SELECT 1 FROM @ColorIDs WHERE ColorID NOT IN (SELECT ColorID FROM Colors))
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'One or more Size do not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            -- Insert AmenityIDs that do not already exist for the given RoomTypeID
            INSERT INTO ProductColors(ProductID, ColorID)
            SELECT @ProductID, a.ColorID 
            FROM @ColorIDs a
            WHERE NOT EXISTS (
                SELECT 1 
                FROM ProductColors ra
                WHERE ra.ProductID = @ProductID AND ra.ColorID = a.ColorID
            );
            SET @Status = 1; -- Success
            SET @Message = 'ProductColor added successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO


CREATE OR ALTER PROCEDURE spBulkUpdateProductColors
    @ProductID INT,
    @ColorIDs ColorIDTableType READONLY,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'Product does not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            DECLARE @Count INT;
            SELECT @Count = COUNT(*) FROM Colors WHERE ColorID IN (SELECT ColorID FROM @ColorIDs);
            IF @Count <> (SELECT COUNT(*) FROM @ColorIDs)
            BEGIN
                SET @Status = 0; -- Failure
                SET @Message = 'One or more color do not exist.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
            DELETE FROM ProductColors WHERE ProductID = @ProductID;
            INSERT INTO ProductColors(ProductID, ColorID)
            SELECT @ProductID, ColorID FROM @ColorIDs;
            SET @Status = 1; -- Success
            SET @Message = 'ProductColor updated successfully.';
            COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO
	


-- Deleting All ProductSize of a Single ProductID
CREATE OR ALTER PROCEDURE spDeleteAllProductColorByProductID
    @ProductID INT,
    @Status BIT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            -- Delete all amenities for the specified room type
            DELETE FROM ProductColors WHERE ProductID = @ProductID;
            SET @Status = 1; -- Success
            SET @Message = 'All Sizes for the Product have been deleted successfully.';
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @Status = 0; -- Failure
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO



	


	CREATE PROCEDURE spUploadImageForProduct
    @ProductID INT,
    @ImageURL NVARCHAR(MAX)
AS
BEGIN
    -- Check if the Product exists before inserting
    IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
    BEGIN
        INSERT INTO Images (ProductID, ImageURL)
        VALUES (@ProductID, @ImageURL);

        SELECT 'Image uploaded successfully.' AS Message;
    END
    ELSE
    BEGIN
        -- If the ProductID doesn't exist, return a message
        SELECT 'Error: ProductID does not exist.' AS Message;
    END
END;

GO

CREATE PROCEDURE spGetAllImages
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra result sets from interfering with SELECT statements.

    SELECT 
        i.ImageID,        -- ID of the image
        i.ProductID,      -- ID of the associated product
        i.ImageURL,       -- URL of the image
        p.ProductName     -- Name of the associated product
    FROM 
        Images i
    JOIN 
        Products p ON i.ProductID = p.ProductID; -- Join to get product names
END;
GO



CREATE PROCEDURE spDeleteImage
    @ImageID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra result sets from interfering with SELECT statements.

    -- Check if the image exists before attempting to delete
    IF EXISTS (SELECT 1 FROM Images WHERE ImageID = @ImageID)
    BEGIN
        DELETE FROM Images 
        WHERE ImageID = @ImageID;

        -- You can return a message or a status indicating success
        SELECT 'Image deleted successfully.' AS Message;
    END
    ELSE
    BEGIN
        -- Return a message if the image does not exist
        SELECT 'Image not found.' AS Message;
    END
END;
GO





-------------------------ENd
	ALTER TABLE OrderDetails
ADD 
    ImageURL NVARCHAR(255),
    ProductCategory NVARCHAR(100),
    ProductColor NVARCHAR(50),
    ProductName NVARCHAR(100),
    ProductSize NVARCHAR(50);



GO



	CREATE PROCEDURE spCreateInventory
    @ProductID INT,
    @StockQuantity int
AS
BEGIN
    -- Check if the Product exists before inserting
    IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
    BEGIN
        INSERT INTO Inventory(ProductID, StockQuantity)
        VALUES (@ProductID, @StockQuantity);

        SELECT 'Cap nhat so luong san pham thanh cong.' AS Message;
    END
    ELSE
    BEGIN
        -- If the ProductID doesn't exist, return a message
        SELECT 'Error: ProductID does not exist.' AS Message;
    END
END;

GO


CREATE PROCEDURE spGetAllInventory
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra result sets from interfering with SELECT statements.

    SELECT 
        i.InventoryID,        -- ID of the image
        i.ProductID,      -- ID of the associated product
        i.StockQuantity,       -- URL of the image
        p.ProductName     -- Name of the associated product
    FROM 
        Inventory i
    JOIN 
        Products p ON i.ProductID = p.ProductID; -- Join to get product names
END;
GO



CREATE PROCEDURE spDeleteInventory
    @InventoryID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra result sets from interfering with SELECT statements.

    -- Check if the image exists before attempting to delete
    IF EXISTS (SELECT 1 FROM Inventory WHERE InventoryID = @InventoryID)
    BEGIN
        DELETE FROM Inventory 
        WHERE InventoryID = @InventoryID;

        -- You can return a message or a status indicating success
        SELECT 'Inventory deleted successfully.' AS Message;
    END
    ELSE
    BEGIN
        -- Return a message if the image does not exist
        SELECT 'Inventory not found.' AS Message;
    END
END;
GO










CREATE TYPE OrderDetailType AS TABLE
(
    ProductID INT,
    Quantity INT,
    UnitPrice DECIMAL(10,2),
    ImageURL NVARCHAR(255),
    ProductCategory NVARCHAR(100),
    ProductColor NVARCHAR(50),
    ProductName NVARCHAR(100),
    ProductSize NVARCHAR(50)
);

go


CREATE OR ALTER PROCEDURE spCreateOrders
    @UserID INT,
    @ShippingAddress NVARCHAR(255),
    @PhoneNumber NVARCHAR(20),
    @TotalAmount DECIMAL(10,2),
    @CartItems OrderDetailType READONLY,  -- Tham số kiểu bảng cho giỏ hàng
    @City NVARCHAR(255),
    @Province NVARCHAR(255),
    @FirstName NVARCHAR(255),
    @LastName NVARCHAR(255),
    @PostalCode NVARCHAR(20),
    @OrderID INT OUTPUT,  -- Thêm tham số đầu ra để trả về OrderID
    @IsSuccess BIT OUTPUT  -- Thêm tham số đầu ra để kiểm tra thành công
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY
        -- Bước 1: Tạo đơn hàng mới
        INSERT INTO Orders (UserID, ShippingAddress, PhoneNumber, TotalAmount, city, province, first_name, last_name, postal_code)
        VALUES (@UserID, @ShippingAddress, @PhoneNumber, @TotalAmount, @City, @Province, @FirstName, @LastName, @PostalCode);

        -- Lấy OrderID của đơn hàng vừa tạo
        SET @OrderID = SCOPE_IDENTITY();

        -- Bước 2: Thêm chi tiết đơn hàng vào bảng OrderDetails
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice, ImageURL, ProductCategory, ProductColor, ProductName, ProductSize)
        SELECT 
            @OrderID, 
            ProductID, 
            Quantity, 
            UnitPrice,
            ImageURL,
            ProductCategory,
            ProductColor,
            ProductName,
            ProductSize
        FROM @CartItems;

        -- Nếu không có lỗi, đặt @IsSuccess = 1
        SET @IsSuccess = 1;
    END TRY
    BEGIN CATCH
        -- Xử lý lỗi: nếu có lỗi, đặt @IsSuccess = 0
        SET @IsSuccess = 0;
    END CATCH
END

GO




create procedure spCreatePaymentMethod
@PaymentMethodName nvarchar(150),
@Message nvarchar(255) output,
@PaymentMethodID int output,
@StatusCode int output

as
begin

set nocount on;
begin try
begin transaction
if not exists (select 1 from PaymentMethod where PaymentMethodName =@PaymentMethodName)
begin
   insert into PaymentMethod(PaymentMethodName)
   values (@PaymentMethodName)

   set @PaymentMethodID = SCOPE_IDENTITY()
   set @StatusCode =0
   set @Message = N'Tao PaymentMethod thanh cong'

  end
else
begin
    set @StatusCode = 1
	set @Message = N'PaymentMethod da ton tai roi, dien cai ten khac'
	end

commit transaction
end try
begin catch
rollback transaction
set @StatusCode = ERROR_NUMBER()
set @Message = ERROR_MESSAGE()
end catch
end
go



CREATE PROCEDURE spGetAllPaymentMethod
@IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @IsActive IS NULL
    BEGIN
        SELECT PaymentMethodID, PaymentMethodName, isActive 
        FROM PaymentMethod;
    END
    ELSE
    BEGIN
        SELECT PaymentMethodID, PaymentMethodName, isActive 
        FROM PaymentMethod
        WHERE isActive = @IsActive;
    END
END
GO


CREATE PROCEDURE spCreatePayment
    @OrderID INT,
    @TotalAmount DECIMAL(10,2), -- T?ng s? ti?n cho don hàng
    @PaymentMethodID INT, -- Phuong th?c thanh toán dã ch?n
    @PaymentStatus NVARCHAR(50) = 'Pending', -- Tr?ng thái thanh toán m?c d?nh
 
    @PaymentID INT OUTPUT, -- Thêm tham s? d?u ra d? tr? v? PaymentID
    @IsSuccess BIT OUTPUT -- Thêm tham s? d?u ra d? ki?m tra thành công
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Bu?c 1: Thêm b?n ghi thanh toán vào b?ng Payment
        INSERT INTO Payment (OrderID, TotalAmount, PaymentMethodID, PaymentStatus)
        VALUES (@OrderID, @TotalAmount, @PaymentMethodID, @PaymentStatus);

        -- L?y PaymentID c?a b?n ghi thanh toán v?a t?o
        SET @PaymentID = SCOPE_IDENTITY();

        -- Bu?c 2: Thêm chi ti?t thanh toán cho m?i s?n ph?m trong don hàng
        INSERT INTO PaymentDetails (PaymentID, ProductID, Quantity, Price)
        SELECT 
            @PaymentID, 
            ProductID, 
            Quantity, 
            UnitPrice
        FROM OrderDetails
        WHERE OrderID = @OrderID;

        -- Bu?c 3: N?u thanh toán thành công, c?p nh?t tr?ng thái don hàng thành 'Completed'
        IF @PaymentStatus = 'Paid'
        BEGIN
            UPDATE Orders
            SET OrderStatus = 'Completed'
            WHERE OrderID = @OrderID;
        END

        -- N?u không có l?i, d?t @IsSuccess = 1
        SET @IsSuccess = 1;
    END TRY
    BEGIN CATCH
        -- X? lý l?i: n?u có l?i, d?t @IsSuccess = 0
        SET @IsSuccess = 0;
    END CATCH
END;


GO






CREATE or alter PROCEDURE spGetAllOrders
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra result sets from interfering with SELECT statements.

    SELECT 
        a.OrderID,        -- ID of the image
        a.Userid,-- Name of the associated product
		a.first_name,
		a.last_name,
		a.city,
		a.province,
		a.postal_code,
        a.OrderDate,
        a.OrderStatus,
        a.ShippingAddress,
        a.PhoneNumber,
        a.TotalAmount
    FROM 
        Orders a
 
END;
GO


EXEC spGetAllOrders;
go



	CREATE or alter PROCEDURE spGetOrdersByUserID
		@UserID INT
	AS
	BEGIN
		SET NOCOUNT ON; 

		SELECT 
		  a.OrderID,        -- ID of the image
        a.Userid,-- Name of the associated product
		a.first_name,
		a.last_name,
		a.city,
		a.province,
		a.postal_code,
        a.OrderDate,
        a.OrderStatus,
        a.ShippingAddress,
        a.PhoneNumber,
        a.TotalAmount
		FROM 
			Orders a
	
		WHERE 
			a.UserID = @UserID; -- Lọc theo UserID
	END;
	GO






CREATE or alter PROCEDURE  spDeleteOrderDetail
    @OrderDetailID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra result sets from interfering with SELECT statements.

    -- Check if the image exists before attempting to delete
    IF EXISTS (SELECT 1 FROM OrderDetails WHERE OrderDetailID = @OrderDetailID)
    BEGIN
        DELETE FROM OrderDetails 
        WHERE OrderDetailID = @OrderDetailID;

        -- You can return a message or a status indicating success
        SELECT 'OrderDetailID deleted successfully.' AS Message;
    END
    ELSE
    BEGIN
        -- Return a message if the image does not exist
        SELECT 'OrderDetailID not found.' AS Message;
    END
END;
GO

CREATE or alter PROCEDURE spGetAllpayment
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
      a.PaymentID,
	  a.OrderID,
	  a.TotalAmount,
	  a.PaymentDate,
	  a.PaymentMethodID,
	  a.PaymentStatus
	  
    FROM 
        Payment a
END;

go
CREATE or alter PROCEDURE spGetAllpaymentdetail
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
      a.PaymentDetailID,
	  a.PaymentID,
	  a.ProductID,
	  a.Quantity,
	  a.Price
    FROM 
        PaymentDetails a
END;





Go
CREATE or alter PROCEDURE spGetAllOrderDetails
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        od.OrderDetailID, 
        od.OrderID, 
        od.ProductID,
		od.ImageURL,
		od.ProductCategory,
		od.ProductColor,
		od.ProductName,
		od.ProductSize,
        od.Quantity, 
        od.UnitPrice, 
        o.OrderDate,
        o.TotalAmount,
        o.OrderStatus
    FROM 
        OrderDetails od
    JOIN 
        Products p ON od.ProductID = p.ProductID
    JOIN 
        Orders o ON od.OrderID = o.OrderID;
END;
GO


CREATE OR ALTER PROCEDURE spGetOrderDetailsByOrderID
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra result sets from interfering with SELECT statements.

    SELECT 
        od.OrderDetailID,       -- ID của chi tiết đơn hàng
        od.OrderID,             -- ID của đơn hàng
        od.ProductID,
		od.ImageURL,-- ID của sản phẩm
		od.ProductColor,
		od.ProductCategory,
		od.ProductSize,
        p.ProductName,          -- Tên của sản phẩm
        od.Quantity,            -- Số lượng sản phẩm
        od.UnitPrice,           -- Đơn giá
        o.OrderDate,            -- Ngày đặt hàng
        o.TotalAmount,          -- Tổng số tiền của đơn hàng
        o.OrderStatus           -- Trạng thái của đơn hàng
    FROM 
        OrderDetails od
    JOIN 
        Products p ON od.ProductID = p.ProductID
    JOIN 
        Orders o ON od.OrderID = o.OrderID
    WHERE 
        od.OrderID = @OrderID; -- Lọc theo OrderID
END;
GO













-- Merchant table
create table Merchant (
    Id nvarchar(50) primary key, -- Removed NULL for the primary key
    MerchantName nvarchar(50) null,
    MerchantWebLink nvarchar(250) null,
    MerchantIpnUrl nvarchar(250) null,
    MerchantReturnUrl nvarchar(250) null,
    SecretKey nvarchar(50) null,
    IsActive bit null

);
go

create table PaymentDestination(
    Id nvarchar(50) primary key, 
    DesLogo nvarchar(250) null,
    DesShortName nvarchar(50) null,
    DesName nvarchar(250) null,
    DesSortIndex int null,
    ParentId nvarchar(50) null,
    IsActive bit null,
    CONSTRAINT FK_PaymentDestination_Parent FOREIGN KEY (ParentId) REFERENCES PaymentDestination(Id) -- Self-referencing foreign key
);
go


-- PaymentMOMO table with foreign keys to Merchant and PaymentDestination
create table PaymentMOMO(
    Id nvarchar(50) primary key, -- Removed NULL for the primary key
    PaymentContent nvarchar(250) null,
    PaymentCurrency nvarchar(10) null,
    PaymentRefId nvarchar(50) null,
    RequiredAmount decimal(19,2) null,
    PaymentDate datetime null,
    ExpiredDate datetime null,
    PaymentLanguage nvarchar(10) null,
    MerchantId nvarchar(50) null,
    PaymentDestinationId nvarchar(50) null,
    PaidAmount decimal(19,2) null,
    PaymentStatus nvarchar(20) null,
    PaymentLastMessage nvarchar(250) null,
	
    CONSTRAINT FK_PaymentMOMO_Merchant FOREIGN KEY (MerchantId) REFERENCES Merchant(Id),
    CONSTRAINT FK_PaymentMOMO_PaymentDestination FOREIGN KEY (PaymentDestinationId) REFERENCES PaymentDestination(Id),

);

go
ALTER TABLE PaymentMOMO
ADD UserID INT NULL,
    OrderID INT NULL;
	go




-- PaymentTransaction table with foreign key to PaymentMOMO
create table PaymentTransaction(
    Id nvarchar(50) primary key, -- Removed NULL for the primary key
    TranMessage nvarchar(250) null,
    TranPayload nvarchar(500) null,
    TranStatus nvarchar(10) null,
    TranAmount decimal(19,2) null,
    TranDate datetime null,
    PaymentId nvarchar(50) null,
    CONSTRAINT FK_PaymentTransaction_PaymentMOMO FOREIGN KEY (PaymentId) REFERENCES PaymentMOMO(Id)
);

go

create table PaymentSignature (
    Id nvarchar(50) primary key, 
    SignValue nvarchar(500) null,
    SignAlgo nvarchar(50) null,
    SignDate datetime null,
    SignOwn nvarchar(50) null,
    PaymentId nvarchar(50) null, 
    CONSTRAINT FK_PaymentSignature_PaymentMOMO FOREIGN KEY (PaymentId) REFERENCES PaymentMOMO(Id)
);

-- PaymentNotification table with foreign keys to PaymentMOMO and Merchant
create table PaymentNotification(
    Id nvarchar(50) primary key, -- Removed NULL for the primary key
    PaymentRefId nvarchar(50) null,
    NotiDate datetime null, -- Changed to datetime instead of nvarchar
    NotiAmount decimal(19,2) null, -- Changed to decimal instead of nvarchar
    NotiContent nvarchar(250) null,
    NotiMessage nvarchar(250) null,
    NotiSignature nvarchar(250) null,
    PaymentId nvarchar(50) null,
    MerchantId nvarchar(50) null,
    NotiStatus nvarchar(50) null,
    NotiResDate datetime null, -- Changed to datetime instead of nvarchar
    CONSTRAINT FK_PaymentNotification_PaymentMOMO FOREIGN KEY (PaymentId) REFERENCES PaymentMOMO(Id),
    CONSTRAINT FK_PaymentNotification_Merchant FOREIGN KEY (MerchantId) REFERENCES Merchant(Id)
);





go

alter table Merchant
add CreatedBy nvarchar(50) null
go

alter table Merchant
add LastUpdatedBy nvarchar(50) null
go

alter table Merchant
add CreatedAt datetime
go
alter table Merchant
add LastUpdatedAt datetime

go
alter table PaymentSignature
add IsValid bit


go

ALTER TABLE Merchant
ALTER COLUMN MerchantName NVARCHAR(250);


GO



--insert merchant
CREATE or alter PROCEDURE [dbo].[sproc_MerchantInsert]
	
	@Id nvarchar(50) ='',
	@MerchantName nvarchar(250) ='',
	@MerchantWebLink nvarchar(250) = '', 
	@MerchantIpnUrl nvarchar(250) = '',
	@MerchantReturnUrl nvarchar(250) ='',
	@MerchantSecretKey nvarchar(50) ='',
	@IsActive bit =0,
	@InsertUser nvarchar(50),
	@InsertedId nvarchar(50) output
AS
BEGIN
 

		if (@Id is null or trim(@Id) ='')
		begin 
		set @Id = 'Mer' + SUBSTRING(master.dbo.fn_varbintohexstr(HASHBYTES('MD5',@MerchantName)),3,32)
		end
	

		if (@MerchantSecretKey is null or trim(@MerchantSecretKey) ='')
		begin 
		set @MerchantSecretKey = NEWID()
		end
		set @InsertedId = @Id

		INSERT INTO [dbo].[Merchant]
           ([Id]
           ,[MerchantName]
           ,[MerchantWebLink]
           ,[MerchantIpnUrl]
           ,[MerchantReturnUrl]
           ,[SecretKey]
           ,[IsActive]
           ,[CreatedBy]
           ,[CreatedAt])

     VALUES
           (@Id
           ,@MerchantName
           ,@MerchantWebLink
           ,@MerchantIpnUrl
           ,@MerchantReturnUrl
           ,@MerchantSecretKey
           ,@IsActive
           ,@InsertUser
           ,GETDATE())
        
END
GO


INSERT INTO Merchant (Id, MerchantName, MerchantWebLink, MerchantIpnUrl, MerchantReturnUrl, SecretKey, IsActive, CreatedBy, LastUpdatedBy, CreatedAt, LastUpdatedAt)
VALUES 
('Mer0dbcf13bd6de6f5eb8064b74cb2caa33', 'Momo Merchant', 'https://momo.vn', 'https://momo.vn/ipn', 'https://momo.vn/return', 'secret123', 1, 'admin', 'admin', GETDATE(), GETDATE());

go

--update merchant

Create procedure  [dbo].[sproc_MerchantUpdate]
@Id nvarchar(50) ='',
	@MerchantName nvarchar(250) ='',
	@MerchantWebLink nvarchar(250) = '',
	@MerchantIpnUrl nvarchar(250) = '',
	@MerchantReturnUrl nvarchar(250) ='',
	@MerchantSecretKey nvarchar(50) ='',
	@IsActive bit =0,
	@UpdateUser nvarchar(50)

	as
	begin
	Update M
	set MerchantName = @MerchantName
	,MerchantIpnUrl = @MerchantIpnUrl
	, MerchantWebLink = @MerchantWebLink
	,MerchantReturnUrl = @MerchantReturnUrl
	,SecretKey = @MerchantSecretKey
	,IsActive = @IsActive
	,LastUpdatedBy = @UpdateUser
	,LastUpdatedAt = GETDATE()
	from Merchant M
	where Id =@Id
	end
	go




	--update merchant active
	Create procedure  [dbo].[sproc_MerchantUpdateActive]
	@Id nvarchar(50) ='',
		@IsActive bit =0,
	@UpdateUser nvarchar(50)

	as
	begin
	Update M
	set 
	IsActive = @IsActive
	,LastUpdatedBy = @UpdateUser
	,LastUpdatedAt = GETDATE()
	from Merchant M
	where Id =@Id
	end
	go



	--delete
	create procedure [dbo].[sproc_MerchantDeleteById]
	@Id nvarchar(50) = ''
	as
	begin
	delete
	from Merchant
	where @Id = Id

	end
	go

	--select merchant by id
	create or alter procedure [dbo].[sproc_MerchantSelectById]
	@Id nvarchar(50) =''
	as
	begin
	set nocount on
	SELECT [Id]
      ,[MerchantName]
      ,[MerchantWebLink]
      ,[MerchantIpnUrl]
      ,[MerchantReturnUrl]
      ,[SecretKey]
      ,[IsActive]
      ,[CreatedBy]
      ,[LastUpdatedBy]
      ,[CreatedAt]
      ,[LastUpdatedAt]
  FROM [dbo].[Merchant] (NOLOCK)
  where 
  Id = @Id
end
go


--select merchant dua tren criteria

create or alter procedure [dbo].[sproc_MerchantSelectByCriteria]
@Criteria nvarchar(500) =''
as
begin
set nocount on

	SELECT [Id]
      ,[MerchantName]
      ,[MerchantWebLink]
      ,[MerchantIpnUrl]
      ,[MerchantReturnUrl]
      ,[SecretKey]
      ,[IsActive]
      ,[CreatedBy]
      ,[LastUpdatedBy]
      ,[CreatedAt]
      ,[LastUpdatedAt]
  FROM [dbo].[Merchant] (NOLOCK)
  where 
  TRIM(@Criteria) = '' or @Criteria is null
  or MerchantName like '%' + @Criteria + '%'
  end
  go



  --select merchant paging

  create or alter procedure [dbo].[sproc_MerchantSelectByCriteriaPaging]

  @PageIndex int =0,
  @PageSize int  =0,
  @Criteria nvarchar(500) ='',
  @TotalPage int output,
  @TotalCount int output
as
begin
set nocount on


declare @Offset int = (@PageIndex -1) * @PageSize;

	SELECT [Id]
      ,[MerchantName]
      ,[MerchantWebLink]
      ,[MerchantIpnUrl]
      ,[MerchantReturnUrl]
      ,[SecretKey]
      ,[IsActive]
      ,[CreatedBy]
      ,[LastUpdatedBy]
      ,[CreatedAt]
      ,[LastUpdatedAt]
  FROM [dbo].[Merchant] (NOLOCK)
  where 
  TRIM(@Criteria) = '' or @Criteria is null
  or MerchantName like '%' + @Criteria + '%'
  order by
  Id
  offset @Offset Rows
  fetch next @PageSize rows only


  SELECT @TotalCount = count(Id)
  FROM [dbo].[Merchant] (NOLOCK)
  where 
  TRIM(@Criteria) = '' or @Criteria is null
  or MerchantName like '%' + @Criteria + '%'

  set @TotalPage = CEILING(@TotalCount / CONVERT(float,@PageSize))
  end
  go



  alter table PaymentMOMO
  add CreatedBy nvarchar(50)
  go

  alter table PaymentMOMO
  add CreatedAt datetime
  go
  --insert payment

CREATE OR ALTER PROCEDURE [dbo].[sproc_PaymentInsert]
    @Id NVARCHAR(50) = '',
    @PaymentContent NVARCHAR(250) = '',
	@OrderID int,
	@UserID int,
    @PaymentCurrency NVARCHAR(50) = null,
    @PaymentRefId NVARCHAR(50) = null,
    @RequiredAmount DECIMAL(19,2) = null,
    @PaymentDate DATETIME = NULL,
    @ExpireDate DATETIME = NULL,
    @PaymentLanguage NVARCHAR(50) = null,
    @MerchantId NVARCHAR(50) = null,
    @PaymentDestinationId NVARCHAR(50) = null,
    @Signature NVARCHAR(100) = '',
    @InsertUser NVARCHAR(50) = '',
    @InsertedId NVARCHAR(50) OUTPUT
AS
BEGIN
    -- Check if @Id is null or empty and generate a new one if necessary
    IF (@Id IS NULL OR LTRIM(RTRIM(@Id)) = '')
    BEGIN
        SET @Id = 'Pay' + SUBSTRING(master.dbo.fn_varbintohexstr(HASHBYTES('MD5', @PaymentRefId)), 3, 32)
    END

    -- Check if @PaymentDate is null, and set it to the current date if necessary
    IF (@PaymentDate IS NULL)
    BEGIN
        SET @PaymentDate = GETDATE()
    END

    -- Check if @ExpireDate is null, and set a default expiry of 15 minutes from the current time
    IF (@ExpireDate IS NULL)
    BEGIN
        SET @ExpireDate = DATEADD(MINUTE, 15, GETDATE())
    END


    -- Insert into the Payment table
    INSERT INTO [dbo].[PaymentMOMO]
        ([Id],
         [PaymentContent],
         [PaymentCurrency],
         [PaymentRefId],
		 [OrderID],
		 [UserID],
         [RequiredAmount],
         [PaymentDate],
         [ExpiredDate],
         [PaymentLanguage],
         [MerchantId],
         [PaymentDestinationId],
         [CreatedBy],
         [CreatedAt])
    VALUES
        (@Id,
         @PaymentContent,
         @PaymentCurrency,
         @PaymentRefId,
		 @OrderID,
		 @UserID,
         @RequiredAmount,
         @PaymentDate,
         @ExpireDate,
         @PaymentLanguage,
         @MerchantId,
         @PaymentDestinationId,
         @InsertUser,
         GETDATE())
		     -- Set the output parameter to the generated or provided @Id
    SET @InsertedId = @Id

	Insert into [dbo].[PaymentSignature]
	([Id]
	,[SignValue]
	,[SignDate]
	,[SignOwn]
	,[PaymentId]
	,[IsValid])
	Values
	(NEWID()
	,@Signature
	,GETDATE()
	,@MerchantId
	,@Id
	,1)

END
GO 


alter table PaymentMOMO
add LastUpdateBy nvarchar(50)
go
alter table PaymentMOMO
add LastUpdateAt datetime
go

create procedure [sproc_PaymentSelectById]
@PaymentId nvarchar(50)
as
begin

set nocount on;
SELECT [Id]
      ,[PaymentContent]
      ,[PaymentCurrency]
      ,[PaymentRefId]
      ,[RequiredAmount]
      ,[PaymentDate]
      ,[ExpiredDate]
      ,[PaymentLanguage]
      ,[MerchantId]
      ,[PaymentDestinationId]
      ,[PaidAmount]
      ,[PaymentStatus]
      ,[PaymentLastMessage]
      ,[CreatedBy]
	  ,[LastUpdateBy]
      ,[CreatedAt]
	  ,[LastUpdateAt]
  FROM [dbo].[PaymentMOMO] (NOLOCK)
  where [Id] = @PaymentId
  end
  go



  alter table PaymentTransaction
  add CreatedBy nvarchar(50)
  go

  alter table PaymentTransaction
  add CreatedAt datetime
  go



  create procedure [dbo].[sproc_PaymentTransactionInsert]

  @Id NVARCHAR(50) = '',
  @TranMessage NVARCHAR(250) = '',
  @TranPayload NVARCHAR(500) = '',
  @TranStatus NVARCHAR(10) = '',
  @TranAmount DECIMAL(19,2) NULL,
  @TranDate DATETIME = NULL,
  @PaymentId NVARCHAR(50) = '',
  @InsertUser NVARCHAR(50) = ''
  as
  begin
  set nocount on;

  if @TranDate is null
  begin
  set @TranDate = GETDATE()
  end

  begin transaction CreatePaymentTransaction
  begin try


  INSERT INTO [dbo].[PaymentTransaction]
           ([Id]
           ,[TranMessage]
           ,[TranPayload]
           ,[TranStatus]
           ,[TranAmount]
           ,[TranDate]
           ,[PaymentId]
		   ,[CreatedBy]
		   ,[CreatedAt])
		   values
		   (@Id
		   ,@TranMessage
		   ,@TranPayload
		   ,@TranStatus
		   ,@TranAmount
		   ,@TranDate
		   ,@PaymentId
		   ,@InsertUser
		   ,GETDATE())

		   update p
		   set
		   p.PaidAmount = t.PaidAmount,
		   p.PaymentLastMessage = @TranMessage,
		   p.PaymentStatus  = @TranStatus,
		   p.LastUpdateAt = GETDATE(),
		   p.LastUpdateBy =@InsertUser
		   
		   from PaymentMOMO p
		   join
		   (
		   select 
		   PaymentId,
		   SUM(TranAmount) as PaidAmount
		   from PaymentTransaction
		   where PaymentId =@PaymentId
		   and TranStatus ='0'
		   group by PaymentId
		   ) t on p.Id = t.PaymentId

		   --commit tran
		   commit transaction CreatePaymentTransaction
		   end try
		   begin catch
		   if @@TRANCOUNT >0
		     BEGIN
      ROLLBACK TRANSACTION CreatePaymentTransaction;
    END

  END CATCH
END;
GO


alter table PaymentDestination
add CreatedBy nvarchar(50)
go
alter table PaymentDestination
add CreatedAt datetime
go



insert into PaymentDestination (Id,DesShortName,DesName,DesSortIndex,CreatedBy,CreatedAt)
values 
('MOMO','MOMO',N'Ví điện tử Momo',1,'HuynhDuc',GETDATE())



go









create or alter procedure spAddProductToWishlist
@FavoriteID int output,
@UserID int,
@Message nvarchar(255) output,
@ProductID int,
@ProductName nvarchar(150),
@Price decimal(10,2),
@ImageID int,
@ProductCategoryName nvarchar(150),
@ImageURL nvarchar(max),
@StatusCode int output


as
begin

set nocount on;
begin try
begin transaction
if not exists (select 1 from UserFavorites where UserID =@UserID and ProductID = @ProductID)
begin
   insert into UserFavorites(UserID,ProductID,ProductName,Price,ProductCategoryName,ImageID,ImageURL,CreatedDate)
   values (@UserID,@ProductID,@ProductName,@Price,@ProductCategoryName,@ImageID,@ImageURL,GETDATE());

   set @FavoriteID = SCOPE_IDENTITY()
   set @StatusCode =0
            SET @Message = N'Sản phẩm đã được thêm vào danh sách yêu thích thành công.';
  end
else
begin
    set @StatusCode = 1
            SET @Message = N'Sản phẩm đã có trong danh sách yêu thích.';
	end

commit transaction
end try
begin catch
rollback transaction
set @StatusCode = ERROR_NUMBER()
set @Message = ERROR_MESSAGE()
end catch
end
go



CREATE or alter PROCEDURE spRemoveProductFromWishlist
    @UserID INT,
    @ProductID INT,
    @Message NVARCHAR(255) OUTPUT,
    @StatusCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Kiểm tra xem sản phẩm có trong danh sách yêu thích của người dùng không
        IF EXISTS (
            SELECT 1
            FROM UserFavorites
            WHERE UserID = @UserID AND ProductID = @ProductID
        )
        BEGIN
            -- Nếu có, xóa sản phẩm khỏi danh sách yêu thích
            DELETE FROM UserFavorites
            WHERE UserID = @UserID AND ProductID = @ProductID;

            SET @StatusCode = 0;
            SET @Message = N'Sản phẩm đã được xóa khỏi danh sách yêu thích thành công.';
        END
        ELSE
        BEGIN
            -- Nếu không có, trả về thông báo
            SET @StatusCode = 1;
            SET @Message = N'Sản phẩm không tồn tại trong danh sách yêu thích.';
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Trả về mã lỗi và thông báo lỗi
        SET @StatusCode = ERROR_NUMBER();
        SET @Message = ERROR_MESSAGE();
    END CATCH;
END;
GO




CREATE or alter PROCEDURE spGetProductWishListById
     @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        FavoriteID,
        UserID,
        ProductID,
        CreatedDate,
        ProductName,
        Price,
        ProductCategoryName,
        ImageID,
        ImageURL
    FROM UserFavorites
    WHERE UserID = @UserID;
	end
GO



CREATE or alter PROCEDURE spGetAllWishList

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN
        SELECT FavoriteID,UserID,ProductID,CreatedDate,ProductName,Price,ProductCategoryName,ImageID,ImageURL
    FROM UserFavorites
    END
 
    
END
GO





CREATE OR ALTER PROCEDURE spSubmitProductFeedback
    @FeedbackID INT OUTPUT,
    @UserID INT,
    @ProductID INT,
    @Rating INT, -- Thêm tham số Rating
    @Comment NVARCHAR(1000),
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Kiểm tra xem người dùng đã mua sản phẩm chưa
        IF EXISTS (
            SELECT 1 
            FROM OrderDetails od
            INNER JOIN Orders o ON o.OrderID = od.OrderID
            WHERE od.ProductID = @ProductID AND o.UserID = @UserID
        )
        BEGIN
            -- Kiểm tra xem phản hồi đã tồn tại cho sản phẩm này bởi người dùng chưa
            IF NOT EXISTS (
                SELECT 1 
                FROM Feedbacks 
                WHERE ProductID = @ProductID AND UserID = @UserID
            )
            BEGIN
                -- Chèn phản hồi vào bảng Feedbacks
                INSERT INTO Feedbacks (ProductID, UserID, Rating, Comment, FeedbackDate) -- Thêm Rating vào INSERT
                VALUES (@ProductID, @UserID, @Rating, @Comment, GETDATE());

                SET @FeedbackID = SCOPE_IDENTITY();
                SET @StatusCode = 0;
                SET @Message = N'Phản hồi của bạn đã được gửi thành công.';
            END
            ELSE
            BEGIN
                -- Phản hồi đã tồn tại
                SET @StatusCode = 1;
                SET @Message = N'Bạn đã gửi phản hồi cho sản phẩm này rồi.';
            END
        END
        ELSE
        BEGIN
            -- Người dùng chưa mua sản phẩm
            SET @StatusCode = 2;
            SET @Message = N'Bạn cần mua sản phẩm này trước khi gửi phản hồi.';
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @StatusCode = ERROR_NUMBER();
        SET @Message = ERROR_MESSAGE();
    END CATCH
END;
GO



CREATE OR ALTER PROCEDURE spGetAllFeedbacks
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        f.FeedbackID,
        f.Comment, 
        f.FeedbackDate,
        f.Rating, -- Thêm Rating
        u.UserID,
        u.lastname,
        p.ProductID
    FROM 
        Feedbacks f
    JOIN 
        Users u ON f.UserID = u.UserID
    JOIN 
        Products p ON f.ProductID = p.ProductID;
END
GO





CREATE OR ALTER PROCEDURE spGetFeedbacksByProductID
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        f.FeedbackID,  
        f.Comment, 
        f.FeedbackDate,
        f.Rating, -- Thêm Rating
        u.UserID,
        u.lastname
    FROM 
        Feedbacks f
    JOIN 
        Users u ON f.UserID = u.UserID
    WHERE 
        f.ProductID = @ProductID; -- Lọc theo ProductID
END
GO







go




CREATE PROCEDURE spToggleOrderStatusActive
    @OrderID INT,
    @NewStatus NVARCHAR(50),
    @StatusCode INT OUTPUT,
    @Message NVARCHAR(255) OUTPUT
AS
BEGIN
    -- Kiểm tra nếu trạng thái mới hợp lệ
    IF @NewStatus NOT IN (N'Đang chờ lấy hàng', N'Shipper đã nhận đơn hàng', N'Đang giao', N'Đã giao')
    BEGIN
        SET @StatusCode = 1;
        SET @Message = N'Trạng thái không hợp lệ.';
        RETURN;
    END

    -- Cập nhật trạng thái đơn hàng
    UPDATE Orders
    SET OrderStatus = @NewStatus
    WHERE OrderID = @OrderID;

    -- Thiết lập phản hồi
    SET @StatusCode = 0;
    SET @Message = N'Cập nhật trạng thái đơn hàng thành công.';
END;
GO




