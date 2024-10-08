USE HeighTeachHaven
GO

-- XÓA DỮ LIỆU TRONG CÁC BẢNG
DELETE FROM AspNetUsers;
DELETE FROM AspNetRoleClaims;
DELETE FROM AspNetRoles;
DELETE FROM AspNetUserClaims;
DELETE FROM AspNetUserLogins;
DELETE FROM AspNetUserRoles;
DELETE FROM AspNetUserTokens;
DELETE FROM Blogs;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Blogs', RESEED, 0);
GO
DELETE FROM Carts;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Carts', RESEED, 0);
GO
DELETE FROM Categories;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Categories', RESEED, 0);
GO
DELETE FROM Comments;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Comments', RESEED, 0);
GO
DELETE FROM DeliveryAddresses;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.DeliveryAddresses', RESEED, 0);
GO
DELETE FROM Favorites;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Favorites', RESEED, 0);
GO
DELETE FROM LikedPosts;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.LikedPosts', RESEED, 0);
GO
DELETE FROM Notifications;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Notifications', RESEED, 0);
GO
DELETE FROM Orders;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Orders', RESEED, 0);
GO
DELETE FROM OrderUpdates;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.OrderUpdates', RESEED, 0);
GO
DELETE FROM OrderDetails;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.OrderDetails', RESEED, 0);
GO
DELETE FROM Posts;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Posts', RESEED, 0);
GO
DELETE FROM Products;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Products', RESEED, 0);
GO
DELETE FROM Reviews;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Reviews', RESEED, 0);
GO
DELETE FROM Suppliers;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.Suppliers', RESEED, 0);
GO
DELETE FROM UserActions;
DBCC CHECKIDENT ('HeighTeachHaven.dbo.UserActions', RESEED, 0);
GO
--END XÓA DỮ LIỆU TRONG CÁC BẢNG


--THÊM DỮ LIỆU VÀO BẢNG AspNetRoles============================================================
INSERT AspNetRoles(Id, Name, NormalizedName) 
VALUES ('21b53cb0-4cb4-4664-8741-eb60de09f38e', 'Administrator', 'ADMINISTRATOR'), 
		('5c245d6d-a3d3-4917-9e56-ecb434d4de7d', 'StoreManager', 'STOREMANAGER'), 
		('9cce4f3f-fd85-497b-9959-59c692a70043', 'Marketing', 'MARKETING'), 
		('e4eb650d-644c-4bea-bc34-5987dda890f1', 'Customer', 'CUSTOMER')
--END THÊM DỮ LIỆU VÀO BẢNG AspNetRoles========================================================
--INSERT AspNetUserRoles(UserId, RoleID) 
--VALUES ('823501ae-9b84-4984-8f4c-d67928710c73', '21b53cb0-4cb4-4664-8741-eb60de09f38e'),
--('823501ae-9b84-4984-8f4c-d67928710c73', '5c245d6d-a3d3-4917-9e56-ecb434d4de7d'),
--('823501ae-9b84-4984-8f4c-d67928710c73', '9cce4f3f-fd85-497b-9959-59c692a70043'),
--('823501ae-9b84-4984-8f4c-d67928710c73', 'e4eb650d-644c-4bea-bc34-5987dda890f1')
--THÊM DỮ LIỆU VÀO BẢNG ActionTypes============================================================
--END THÊM DỮ LIỆU VÀO BẢNG ActionTypes========================================================

--TEST=========================================================================================
select * from AspNetUsers
--delete from AspNetUsers where Id='e862d24b-294f-4461-a0fa-70f924bf1504'
--select * from AspNetRoles
--select * from AspNetUserRoles
--select * from Posts
--select * from PostStatus
--select * from Blogs
select * from Products
select * from ProductColors
select * from ProductStatus
select * from ProductOptions
select * from ProductOptionTypes
select * from ProductImages
select * from ProductVariants
--select * from ProductImages
--select * from Favorites
--select * from Categories
--select * from Suppliers
--select * from Comments
--select * from LikedComments
--select * from Reviews
select * from Notifications
select * from UserNotifications

--select * from Carts
--select * from Orders
--select * from OrderDetails
--select * from OrderUpdates
SELECT * FROM OrderUpdates WHERE UpdateName = 'Completed'
--select *From DeliveryAddresses
--select * from UserActions
--select * from Orders
--END TEST=====================================================================================

UPDATE OrderUpdates SET Status = 1 WHERE UpdateName ='Cancelled'
--Cập nhập OrderUpdate=====================================================================================
DECLARE @StartDate DATETIME = GETDATE(); -- Ngày hôm nay
DECLARE @TotalRecords INT;

-- Tính tổng số bản ghi
SET @TotalRecords = (SELECT COUNT(*) FROM OrderUpdates WHERE Id <= 215);

;WITH CTE AS (
    SELECT 
        Id,
        ROW_NUMBER() OVER (ORDER BY Id DESC) - 1 AS RowNum -- Đánh số từ lớn đến nhỏ
    FROM 
        OrderUpdates
    WHERE 
        Id <= 215
)
UPDATE O
SET 
    UpdateTime = DATEADD(DAY, -RowNum, @StartDate) -- Giảm số ngày dựa trên RowNum
FROM 
    OrderUpdates O
JOIN 
    CTE ON O.Id = CTE.Id;

--END Cập nhập OrderUpdate=====================================================================================

