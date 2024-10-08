using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Infastructure.Data;
using API_Server.Infastructure.Identity.IdentityModels;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private bool disposedValue;
        private readonly API_ServerContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private IDbContextTransaction _transaction;
        private readonly IMapper _mapper;

        #region Repository
        IGenericRepository<Supplier> _repositorySuppliers;
        IGenericRepository<Category> _repositoryCategories;
        IGenericRepository<UserAction> _repositoryUserActions;
        IGenericRepository<Product> _repositoryProducts;
        IGenericRepository<ProductColor> _repositoryProductColors;
        IGenericRepository<ProductImage> _repositoryProductImages;
        IGenericRepository<ProductOption> _repositoryProductOptions;
        IGenericRepository<ProductOptionType> _repositoryProductOptionTypes;
        IGenericRepository<ProductStatus> _repositoryProductStatus;
        IGenericRepository<ProductVariant> _repositoryProductVariants;
        IGenericRepository<Favourite> _repositoryFavorites;
        IGenericRepository<Review> _repositoryReviews;
        IGenericRepository<Blog> _repositoryBlogs;
        IGenericRepository<Post> _repositoryPost;
        IGenericRepository<PostStatus> _repositoryPostStatus;
        IGenericRepository<Comment> _repositoryComments;
        IGenericRepository<LikedComment> _repositoryLikedComment;
        IGenericRepository<LikedPost> _repositoryLikedPost;
        IGenericRepository<Cart> _repositoryCart;
        IGenericRepository<Order> _repositoryOrder;
        IGenericRepository<OrderDetail> _repositoryOrderDetail;
        IGenericRepository<OrderUpdate> _repositoryOrderUpdate;
        IGenericRepository<DeliveryAddress> _repositoryDeliveryAddresses;
        IGenericRepository<Notification> _repositoryNotification;
        IGenericRepository<UserNotification> _repositoryUserNotification;
        #endregion

        IUsersRepository _repositoryUsers;

        #region Include with user
        IIncludeWithUser<ProductStatus> _includeProductStatusWithUser;
        IIncludeWithUser<PostStatus> _includePostStatusWithUser;
        IIncludeWithUser<Favourite> _includeFavoriteWithUser;
        IIncludeWithUser<Review> _includeReviewWithUser;
        IIncludeWithUser<Comment> _includeCommentWithUser;
        IIncludeWithUser<LikedComment> _includeLikedCommentWithUser;
        IIncludeWithUser<LikedPost> _includeLikedPostWithUser;
        IIncludeWithUser<UserAction> _includeUserActionWithUser;
        IIncludeWithUser<Cart> _includeCartWithUser;
        IIncludeWithUser<Order> _includeOrderWithUser;
        IIncludeWithUser<DeliveryAddress> _includeDeliveryAddressWithUser;
        IIncludeWithUser<UserNotification> _includeUserNotification;
        #endregion

        public UnitOfWork(API_ServerContext context, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }
        #region Implementation IUnitOfWorkB

        #region Repository
        public IGenericRepository<Supplier> RepositorySuppliers { get { return _repositorySuppliers ??= new GenericRepository<Supplier>(_context); } }
        public IGenericRepository<Category> RepositoryCategories { get { return _repositoryCategories ??= new GenericRepository<Category>(_context); } }
        public IGenericRepository<Product> RepositoryProducts { get { return _repositoryProducts ??= new GenericRepository<Product>(_context); } }
        public IGenericRepository<ProductColor> RepositoryProductColors { get { return _repositoryProductColors ??= new GenericRepository<ProductColor>(_context); } }
        public IGenericRepository<ProductImage> RepositoryProductImages { get { return _repositoryProductImages ??= new GenericRepository<ProductImage>(_context); } }
        public IGenericRepository<ProductOption> RepositoryProductOptions { get { return _repositoryProductOptions ??= new GenericRepository<ProductOption>(_context); } }
        public IGenericRepository<ProductOptionType> RepositoryProductOptionTypes { get { return _repositoryProductOptionTypes ??= new GenericRepository<ProductOptionType>(_context); } }
        public IGenericRepository<ProductStatus> RepositoryProductStatus { get { return _repositoryProductStatus ??= new GenericRepository<ProductStatus>(_context); } }
        public IGenericRepository<ProductVariant> RepositoryProductVariants { get { return _repositoryProductVariants ??= new GenericRepository<ProductVariant>(_context); } }
        public IGenericRepository<Favourite> RepositoryFavorites { get { return _repositoryFavorites ??= new GenericRepository<Favourite>(_context); } }
        public IGenericRepository<Review> RepositoryReviews { get { return _repositoryReviews ??= new GenericRepository<Review>(_context); } }
        public IGenericRepository<Blog> RepositoryBlogs { get { return _repositoryBlogs ??= new GenericRepository<Blog>(_context); } }
        public IGenericRepository<Post> RepositoryPosts { get { return _repositoryPost ??= new GenericRepository<Post>(_context); } }
        public IGenericRepository<PostStatus> RepositoryPostStatus { get { return _repositoryPostStatus ??= new GenericRepository<PostStatus>(_context); } }
        public IGenericRepository<Comment> RepositoryComments { get { return _repositoryComments ??= new GenericRepository<Comment>(_context); } }
        public IGenericRepository<LikedComment> RepositoryLikedComment { get { return _repositoryLikedComment ??= new GenericRepository<LikedComment>(_context); } }
        public IGenericRepository<LikedPost> RepositoryLikedPost { get { return _repositoryLikedPost ??= new GenericRepository<LikedPost>(_context); } }
        public IGenericRepository<Cart> RepositoryCarts { get { return _repositoryCart ??= new GenericRepository<Cart>(_context); } }
        public IGenericRepository<Order> RepositoryOrders { get { return _repositoryOrder ??= new GenericRepository<Order>(_context); } }
        public IGenericRepository<OrderUpdate> RepositoryOrderUpdates { get { return _repositoryOrderUpdate ??= new GenericRepository<OrderUpdate>(_context); } }
        public IGenericRepository<DeliveryAddress> RepositoryDeliveryAddresses { get { return _repositoryDeliveryAddresses ??= new GenericRepository<DeliveryAddress>(_context); } }
        public IGenericRepository<OrderDetail> RepositoryOrderDetails { get { return _repositoryOrderDetail ??= new GenericRepository<OrderDetail>(_context); } }
        public IGenericRepository<UserAction> RepositoryUserActions { get { return _repositoryUserActions ??= new GenericRepository<UserAction>(_context); } }
        public IGenericRepository<Notification> RepositoryNotification { get { return _repositoryNotification ??= new GenericRepository<Notification>(_context); } }
        public IGenericRepository<UserNotification> RepositoryUserNotification { get { return _repositoryUserNotification ??= new GenericRepository<UserNotification>(_context); } }
        #endregion
        public IUsersRepository RepositoryUsers { get { return _repositoryUsers ??= new UsersRepository(_context, _mapper, _userManager); } }

        #region Include with user
        public IIncludeWithUser<ProductStatus> IncludeProductStatusWithUser { get { return _includeProductStatusWithUser ??= new IncludeWithUser<ProductStatus>(_context, _mapper); } }
        public IIncludeWithUser<PostStatus> IncludePostStatusWithUser { get { return _includePostStatusWithUser ??= new IncludeWithUser<PostStatus>(_context, _mapper); } }
        public IIncludeWithUser<Favourite> IncludeFavoriteWithUser { get { return _includeFavoriteWithUser ??= new IncludeWithUser<Favourite>(_context, _mapper); } }
        public IIncludeWithUser<Review> IncludeReviewWithUser { get { return _includeReviewWithUser ??= new IncludeWithUser<Review>(_context, _mapper); } }
        public IIncludeWithUser<Comment> IncludeCommentWithUser { get { return _includeCommentWithUser ??= new IncludeWithUser<Comment>(_context, _mapper); } }
        public IIncludeWithUser<LikedComment> IncludeLikedCommentWithUser { get { return _includeLikedCommentWithUser ??= new IncludeWithUser<LikedComment>(_context, _mapper); } }
        public IIncludeWithUser<LikedPost> IncludeLikedPostWithUser { get { return _includeLikedPostWithUser ??= new IncludeWithUser<LikedPost>(_context, _mapper); } }
        public IIncludeWithUser<UserAction> IncludeUserActionWithUser { get { return _includeUserActionWithUser ??= new IncludeWithUser<UserAction>(_context, _mapper); } }
        public IIncludeWithUser<Cart> IncludeCartWithUser { get { return _includeCartWithUser ??= new IncludeWithUser<Cart>(_context, _mapper); } }
        public IIncludeWithUser<Order> IncludeOrderWithUser { get { return _includeOrderWithUser ??= new IncludeWithUser<Order>(_context, _mapper); } }
        public IIncludeWithUser<DeliveryAddress> IncludeDeliveryAddressWithUser { get { return _includeDeliveryAddressWithUser ??= new IncludeWithUser<DeliveryAddress>(_context, _mapper); } }
        public IIncludeWithUser<UserNotification> IncludeUserNotification { get { return _includeUserNotification ??= new IncludeWithUser<UserNotification>(_context, _mapper); } }
        #endregion

        #endregion

        #region Transaction

        /// <summary>
        /// Begin transaction async
        /// </summary>
        /// <returns></returns>
        public async Task<IDisposable> BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
            return _transaction;
        }

        /// <summary>
        /// Commit transaction and then dispose async
        /// </summary>
        /// <returns></returns>
        public async Task CommitTransactionAsync()
        {
            try
            {
                await _transaction.CommitAsync();
            }
            finally
            {
                await _transaction.DisposeAsync();
            }
        }

        /// <summary>
        /// Rollback transaction and then dispose async
        /// </summary>
        /// <returns></returns>
        public async Task RollbackTransactionAsync()
        {
            try
            {
                await _transaction.RollbackAsync();
            }
            finally
            {
                await _transaction.DisposeAsync();
            }
        }

        #endregion

        /// <summary>
        /// Save change to database
        /// </summary>
        /// <returns></returns>
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    _context.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
        // ~UnitOfWork()
        // {
        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        //     Dispose(disposing: false);
        // }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

    }

}
