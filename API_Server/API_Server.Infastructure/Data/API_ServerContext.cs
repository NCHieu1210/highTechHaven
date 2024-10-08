using API_Server.Domain.Entities;
using API_Server.Infastructure.Identity.IdentityModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Data
{
    public class API_ServerContext : IdentityDbContext<ApplicationUser>
    {
        public API_ServerContext(DbContextOptions<API_ServerContext> options) : base(options)
        {
        }

        #region Configure Dbset
        public DbSet<API_Server.Domain.Entities.Blog> Blogs { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Cart> Carts { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Category> Categories { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Comment> Comments { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.DeliveryAddress> DeliveryAddresses { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Favourite> Favorites { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.LikedComment> LikedComments { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.LikedPost> LikedPosts { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Notification> Notifications { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Order> Orders { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.OrderDetail> OrderDetails { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.OrderUpdate> OrderUpdates { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Post> Posts { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.PostStatus> PostStatus { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Product> Products { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.ProductColor> ProductColors { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.ProductImage> ProductImages { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.ProductOption> ProductOptions { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.ProductOptionType> ProductOptionTypes { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.ProductStatus> ProductStatus { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.ProductVariant> ProductVariants { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Review> Reviews { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.Supplier> Suppliers { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.UserAction> UserActions { get; set; } = default!;
        public DbSet<API_Server.Domain.Entities.UserNotification> UserNotifications { get; set; } = default!;
        #endregion

        #region Configure Fluent API
        protected override void OnModelCreating(ModelBuilder builder)
        {
            
            base.OnModelCreating(builder);

            #region Configure a unique name for the entity
            builder.Entity<Blog>().HasIndex(p => p.Name).IsUnique();          //Blogs
            builder.Entity<Category>().HasIndex(p => p.Name).IsUnique();     //Categories
            builder.Entity<Post>().HasIndex(p => p.Name).IsUnique();        //Posts
            builder.Entity<Product>().HasIndex(p => p.Name).IsUnique();    //Products
            builder.Entity<Supplier>().HasIndex(p => p.Name).IsUnique();  //Suppliers
            #endregion

            #region Configure the relationship between ApplicationUser and Cart
            //Configure the relationship between ApplicationUser and Cart
            builder.Entity<Cart>()
                .HasOne<ApplicationUser>()
                .WithMany(p => p.Carts)
                .HasForeignKey(o => o.UserID)
                .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and Cart
            #endregion


            #region Configure the relationship for Products

            #region Configure the relationship between ApplicationUser and ProductStatus
            //Configure the relationship between ApplicationUser and ProductStatus
            builder.Entity<ProductStatus>()
                .HasOne<ApplicationUser>()
                .WithMany(p => p.ProductStatus)
                .HasForeignKey(o => o.UserID)
                .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and ProductStatus
            #endregion

            #region Configure the relationship between ApplicationUser and Product
            //Configure the relationship between Product and Category
            builder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(p => p.Products)
                .HasForeignKey(o => o.CategoryID)
                .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between Product and Category


            //END Configure the relationship between Product and Supplier
            builder.Entity<Product>()
               .HasOne(p => p.Supplier)
               .WithMany(p => p.Products)
               .HasForeignKey(o => o.SupplierID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between Product and Supplier
            #endregion


            #region Configure the relationship between ProductImage and Product
            builder.Entity<ProductImage>()
            .HasOne(pI => pI.Product)
            .WithMany(p => p.ProductImages)
            .HasForeignKey(pI => pI.ProductID)
            .OnDelete(DeleteBehavior.Cascade); // When deleting a product, also delete the related photo
            #endregion

            #region Configure the relationship between ProductOption and Product
            builder.Entity<ProductOption>()
            .HasOne(pO => pO.Product)
            .WithMany(p => p.ProductOptions)
            .HasForeignKey(pO => pO.ProductID)
            .OnDelete(DeleteBehavior.Cascade); // When deleting a product, also delete the related photo
            #endregion

            #region Configure the relationship between ProductStatus and Product
            builder.Entity<ProductStatus>()
            .HasOne(pS => pS.Product)
            .WithMany(p => p.ProductStatus)
            .HasForeignKey(pS => pS.ProductID)
            .OnDelete(DeleteBehavior.Cascade); // When deleting a product, also delete the related photo
            #endregion
            
            #region Configure the relationship between ProductImages and ProductVariant
            builder.Entity<ProductVariant>()
            .HasOne(pV => pV.ProductImage)
            .WithMany(p => p.ProductVariants)
            .HasForeignKey(pV => pV.ProductImageID)
            .OnDelete(DeleteBehavior.Restrict); 
            #endregion

            #region Configure the relationship between ProductImages and ProductVariant
            builder.Entity<ProductVariant>()
            .HasOne(pV => pV.ProductOption)
            .WithMany(p => p.ProductVariants)
            .HasForeignKey(pV => pV.ProductOptionID)
            .OnDelete(DeleteBehavior.Restrict);
            #endregion

            #endregion

            #region Configure the relationship between ApplicationUser and Comment
            builder.Entity<Comment>()
                .HasOne<ApplicationUser>()
                .WithMany(p => p.Comments)
                .HasForeignKey(o => o.UserID)
                .OnDelete(DeleteBehavior.Restrict);
            #endregion

            #region Configure the relationship between ApplicationUser and DeliveryAddress
            builder.Entity<DeliveryAddress>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.DeliveryAddresses)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            #endregion

            #region Configure the relationship between ApplicationUser and Favorite
            // Configure the relationship between ApplicationUser and Favorite
            builder.Entity<Favourite>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.Favorites)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and Favorite
            #endregion

            #region Configure the relationship between ApplicationUser and LikedPost
            // Configure the relationship between ApplicationUser and LikedPost
            builder.Entity<LikedPost>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.LikedPosts)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and LikedPost
            #endregion

            #region Configure the relationship between ApplicationUser and LikedComment
            // Configure the relationship between ApplicationUser and LikedComment
            builder.Entity<LikedComment>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.LikedComments)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and LikedPost
            #endregion

            #region Configure the relationship between ApplicationUser and Notification
            // Configure the relationship between ApplicationUser and Notification
            builder.Entity<UserNotification>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.UserNotifications)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and LikedPost
            #endregion

            #region Configure the relationship between ApplicationUser and Order
            // Configure the relationship between ApplicationUser and Order
            builder.Entity<Order>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.Orders)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and Order
            #endregion

            #region Configure the relationship between ApplicationUser and Post
            // Configure the relationship between ApplicationUser and Post
            builder.Entity<PostStatus>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.PostStatus)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Post>()
                .HasOne(p => p.Blog)
                .WithMany(p => p.Posts)
                .HasForeignKey(o => o.BlogID)
                .OnDelete(DeleteBehavior.SetNull);
            //END Configure the relationship between ApplicationUser and Post
            #endregion

            #region Configure the relationship between ApplicationUser and Review
            // Configure the relationship between ApplicationUser and Review
            builder.Entity<Review>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.Reviews)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and Review
            #endregion

            #region Configure the relationship between ApplicationUser and UserAction
            // Configure the relationship between ApplicationUser and UserAction
            builder.Entity<UserAction>()
               .HasOne<ApplicationUser>()
               .WithMany(p => p.UserActions)
               .HasForeignKey(o => o.UserID)
               .OnDelete(DeleteBehavior.Restrict);
            //END Configure the relationship between ApplicationUser and UserAction
            #endregion
        }
        #endregion
    }
}
