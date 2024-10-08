using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        #region Repository
        /// <summary>
        /// Definition IRepositorySuppliers
        /// </summary>
        IGenericRepository<Supplier> RepositorySuppliers { get; }

        /// <summary>
        /// Definition IRepositorySuppliers
        /// </summary>
        IGenericRepository<Category> RepositoryCategories { get; }

        /// <summary>
        /// Definition RepositoryProducts
        /// </summary>
        IGenericRepository<Product> RepositoryProducts { get; }

        /// <summary>
        /// Definition RepositoryProductColors
        /// </summary>
        IGenericRepository<ProductColor> RepositoryProductColors { get; }

        /// <summary>
        /// Definition RepositoryProductImages
        /// </summary>
        IGenericRepository<ProductImage> RepositoryProductImages { get; }

        /// <summary>
        /// Definition RepositoryProductOptions
        /// </summary>
        IGenericRepository<ProductOption> RepositoryProductOptions { get; }

        /// <summary>
        /// Definition RepositoryProductOptionTypes
        /// </summary>
        IGenericRepository<ProductOptionType> RepositoryProductOptionTypes { get; }

        /// <summary>
        /// Definition RepositoryProductStatus
        /// </summary>
        IGenericRepository<ProductStatus> RepositoryProductStatus { get; }

        /// <summary>
        /// Definition RepositoryProductVariants
        /// </summary>
        IGenericRepository<ProductVariant> RepositoryProductVariants { get; }

        /// <summary>
        /// Definition RepositoryFavorites
        /// </summary>
        IGenericRepository<Favourite> RepositoryFavorites { get; }

        /// <summary>
        /// Definition RepositoryReviews
        /// </summary>
        IGenericRepository<Review> RepositoryReviews { get; }

        /// <summary>
        /// Definition RepositoryBlogs
        /// </summary>
        IGenericRepository<Blog> RepositoryBlogs { get; }

        /// <summary>
        /// Definition RepositoryPosts
        /// </summary>
        IGenericRepository<Post> RepositoryPosts { get; }

        /// <summary>
        /// Definition RepositoryPosts
        /// </summary>
        IGenericRepository<PostStatus> RepositoryPostStatus { get; }

        /// <summary>
        /// Definition RepositoryComments
        /// </summary>
        IGenericRepository<Comment> RepositoryComments { get; }

        /// <summary>
        /// Definition RepositoryLikedComment
        /// </summary>
        IGenericRepository<LikedComment> RepositoryLikedComment { get; }

        /// <summary>
        /// Definition RepositoryLikedPost
        /// </summary>
        IGenericRepository<LikedPost> RepositoryLikedPost { get; }

        /// <summary>
        /// Definition RepositoryCarts
        /// </summary>
        IGenericRepository<Cart> RepositoryCarts { get; }

        /// <summary>
        /// Definition RepositoryUserActions
        /// </summary>
        IGenericRepository<UserAction> RepositoryUserActions { get; }

        /// <summary>
        /// Definition RepositoryOrders
        /// </summary>
        IGenericRepository<Order> RepositoryOrders { get; }

        /// <summary>
        /// Definition RepositoryDeliveryAddresses
        /// </summary>
        IGenericRepository<DeliveryAddress> RepositoryDeliveryAddresses { get; }

        /// <summary>
        /// Definition RepositoryOrderDetails
        /// </summary>
        IGenericRepository<OrderDetail> RepositoryOrderDetails { get; }

        /// <summary>
        /// Definition RepositoryOrderUpdates
        /// </summary>
        IGenericRepository<OrderUpdate> RepositoryOrderUpdates { get; }

        /// <summary> 
        /// Definition RepositoryNotification
        /// </summary>
        IGenericRepository<Notification> RepositoryNotification { get; }

        /// <summary>
        /// Definition RepositoryUserNotification
        /// </summary>
        IGenericRepository<UserNotification> RepositoryUserNotification { get; }

        #endregion

        /// <summary>
        /// Definition RepositoryUsers
        /// </summary>
        IUsersRepository RepositoryUsers { get; }

        #region Include with user
        /// <summary>
        /// Definition IncludeProductWithUser
        /// </summary>
        IIncludeWithUser<ProductStatus> IncludeProductStatusWithUser { get; }

        /// <summary>
        /// Definition IncludePostWithUser
        /// </summary>
        IIncludeWithUser<PostStatus> IncludePostStatusWithUser { get; }

        /// <summary>
        /// Definition IncludeFavoriteWithUser
        /// </summary>
        IIncludeWithUser<Favourite> IncludeFavoriteWithUser { get; }

        /// <summary>
        /// Definition IncludeReviewWithUser
        /// </summary>
        IIncludeWithUser<Review> IncludeReviewWithUser { get; }

        /// <summary>
        /// Definition IncludeCommentWithUser
        /// </summary>
        IIncludeWithUser<Comment> IncludeCommentWithUser { get; }

        /// <summary>
        /// Definition IncludeLikedCommentWithUser
        /// </summary>
        IIncludeWithUser<LikedComment> IncludeLikedCommentWithUser { get; }

        /// <summary>
        /// Definition IncludeLikedPostWithUser
        /// </summary>
        IIncludeWithUser<LikedPost> IncludeLikedPostWithUser { get; }

        /// <summary>
        /// Definition IncludeUserActionWithUser
        /// </summary>
        IIncludeWithUser<UserAction> IncludeUserActionWithUser { get; }

        /// <summary>
        /// Definition IncludeUserActionWithUser
        /// </summary>
        IIncludeWithUser<Cart> IncludeCartWithUser { get; }

        /// <summary>
        ///  Definition IncludeDeliveryAddressWithUser
        /// </summary>
        IIncludeWithUser<DeliveryAddress> IncludeDeliveryAddressWithUser { get; }

        /// <summary>
        /// Definition IncludeOrderWithUser
        /// </summary>
        IIncludeWithUser<Order> IncludeOrderWithUser { get; }

        /// <summary>
        /// Definition IncludeUserNotification
        /// </summary>
        IIncludeWithUser<UserNotification> IncludeUserNotification { get; }
        #endregion

        #region Transaction 

        /// <summary>
        /// Definition BeginTransactionAsync
        /// </summary>
        /// <returns></returns>
        Task<IDisposable> BeginTransactionAsync();

        /// <summary>
        /// Definition CommitTransactionAsync
        /// </summary>
        /// <returns></returns>
        Task CommitTransactionAsync();

        /// <summary>
        /// Definition RollbackTransactionAsync
        /// </summary>
        /// <returns></returns>
        Task RollbackTransactionAsync();
        #endregion

        /// <summary>
        /// Save Changes to Database
        /// </summary>
        /// <returns></returns>
        Task SaveChangesAsync();
    }
}
