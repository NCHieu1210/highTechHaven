using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using AutoMapper;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_Server.Application.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            #region Mapper for Supplier
            //Mapper for Supplier
            CreateMap<Supplier, SupplierVM>().ReverseMap();
            CreateMap<Supplier, SupplierDTO>().ReverseMap();
            #endregion

            #region Mapper for Category
            //Mapper for Category
            CreateMap<Category, CategoryDTO>().ReverseMap();
            //Mapper properties with different names
            CreateMap<Category, CategoryVM>()
                .ForMember(dest => dest.ParentCategory, o => o.MapFrom(src => src.ParentCategory.Name))
                .ForMember(dest => dest.QuantityProducts, o => o.MapFrom(src => src.SubCategories.Any() 
                                                        ? src.Products.Count + src.SubCategories.Sum(s => s.Products.Count) 
                                                        : src.Products.Count ))
                .ReverseMap();
            #endregion

            #region Mapper for User
            CreateMap<User, RegisterDTO>().ReverseMap();
            CreateMap<User, LoginVM>().ReverseMap();
            CreateMap<User, UserInAdminDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<DeliveryAddress, DeliveryAddressDTO>().ReverseMap();
            #endregion

            #region Mapper for Product
            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<Product, ProductsVM>()
                .ForMember(dest => dest.Category, o => o.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Supplier, o => o.MapFrom(src => src.Supplier.Name))
                .ReverseMap();

            CreateMap<Product, ProductVariantBySlugVM>()
                .ForMember(dest => dest.Category, o => o.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Supplier, o => o.MapFrom(src => src.Supplier.Name))
                .ReverseMap();

            CreateMap<Product, ProductDetailVM>()
                .ForMember(dest => dest.Category, o => o.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Supplier, o => o.MapFrom(src => src.Supplier.Name))
                .ReverseMap();

            CreateMap<ProductColor, ProductColorVM>().ReverseMap();
            CreateMap<ProductImage, ProductImageVM>().ReverseMap();

            CreateMap<ProductStatus, ProductStatusVM>()
                .ForMember(dest => dest.UserFullName, o => o.MapFrom(src => $"{src.User.FirstName}  {src.User.LastName}"))
                .ReverseMap();

            //Configurate ProductOption mapping 
            CreateMap<ProductOption, ProductOptionVM>()
                .ForMember(dest => dest.Option, o => o.MapFrom(src => src.ProductOptionType.Option))
                .ReverseMap();
            CreateMap<ProductOption, OptionBySlugVM>()
                .ForMember(dest => dest.Variants, o => o.MapFrom(src => src.ProductVariants))
                .ForMember(dest => dest.Option, o => o.MapFrom(src => src.ProductOptionType.Option))
                .ReverseMap();

            //Configurate ProductVariant mapping 
            CreateMap<ProductVariant, ProductVariantVM>()
                .ForMember(dest => dest.OptionID, o => o.MapFrom(src => src.ProductOptionID))
                .ForMember(dest => dest.Option, o => o.MapFrom(src => src.ProductOption.ProductOptionType.Option))
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.ProductOption.Product.Name))
                .ForMember(dest => dest.ColorID, o => o.MapFrom(src => src.ProductColorID))
                .ForMember(dest => dest.Color, o => o.MapFrom(src => src.ProductColor.Color))
                .ForMember(dest => dest.Thumbnail, o => o.MapFrom(src => src.ProductImage.Image))
                .ReverseMap();

            CreateMap<ProductVariant, ProductVariantDetailVM>()
                .ForMember(dest => dest.Color, o => o.MapFrom(src => src.ProductColor.Color))
                .ForMember(dest => dest.Thumbnail, o => o.MapFrom(src => src.ProductImage.Image))
                .ReverseMap();

            CreateMap<ProductVariantDetailVM, VariantBySlugVM>().ReverseMap();

            CreateMap<ProductVariant, ProductVariantInCartVM>()
                .ForMember(dest => dest.Slug, o => o.MapFrom(src => src.ProductOption.Product.Slug))
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.ProductOption.Product.Name))
                .ForMember(dest => dest.Thumbnail, o => o.MapFrom( src => src.ProductImage.Image))
                .ForMember(dest => dest.Option, o => o.MapFrom( src => src.ProductOption.ProductOptionType.Option))
                .ForMember(dest => dest.Color, o => o.MapFrom( src => src.ProductColor.Color))
                .ReverseMap();

            CreateMap<ProductImage, ProductImageDTO>().ReverseMap();
            CreateMap<ProductVariant, ProductVariantDTO>().ReverseMap();

            #endregion

            #region Mapper for Post
            CreateMap<Post, PostDTO>().ReverseMap();
            CreateMap<Post, PostVM>().ReverseMap();
            CreateMap<Post, PostVM>()
                .ForMember(dest => dest.Blog, o => o.MapFrom(src => src.Blog.Name))
                .ReverseMap();
            CreateMap<PostStatus, PostStatusVM>()
                .ForMember(dest => dest.UserFullName, o => o.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.Avatar, o => o.MapFrom(src => src.User.Avatar))
                .ReverseMap();
            #endregion

            #region Mapper for Favorite
            //Mapper for Favorite
            CreateMap<Favourite, FavouriteVM>()
                /*.ForMember(dest => dest.Product, o => o.MapFrom(src => src.ProductOption.ProductVariants))*/
                .ReverseMap();
            #endregion

            #region Mapper for Review
            //Mapper for Review
            CreateMap<ReviewDTO, Review>().ReverseMap();
            CreateMap<Review, ReviewVM>()
                .ForMember(dest => dest.LastReviewTime, o => o.MapFrom(src => (DateTime.UtcNow - src.ReviewDate)))
                .ForMember(dest => dest.SlugUser, o => o.MapFrom(src => src.User.Slug))
                .ForMember(dest => dest.UserAvatar, o => o.MapFrom(src => src.User.Avatar))
                .ForMember(dest => dest.UserFullName, o => o.MapFrom(src => $"{src.User.FirstName}{src.User.LastName}"))
                .ReverseMap();
            #endregion

            #region Mapper for Comment
            //Mapper for Review
            CreateMap<Comment, CommentDTO>().ReverseMap();
            CreateMap<Comment, CommentVM >()
                .ForMember(dest => dest.LastCommentTime, o => o.MapFrom(src => (DateTime.UtcNow - src.CreatedDate)))
                .ReverseMap();

            CreateMap<User, UserCommentVM>().ReverseMap();
            #endregion

            #region Mapper for Liked
            //Mapper for liked comment
            CreateMap<LikedComment, LikedCommentDTO>().ReverseMap();
            CreateMap<LikedComment, LikedCommentVM>()
                .ForMember(dest => dest.CommentID, o => o.MapFrom(src => src.CommentID))
                .ForMember(dest => dest.LastLikedTime, o => o.MapFrom(src => (DateTime.UtcNow - src.LikedDate)))
                .ReverseMap();

            //Mapper for liked post
            CreateMap<LikedPost, LikedPostDTO>().ReverseMap();
            CreateMap<LikedPost, LikedPostVM>()
                .ForMember(dest => dest.PostID, o => o.MapFrom(src => src.PostID))
                .ForMember(dest => dest.LastLikedTime, o => o.MapFrom(src => (DateTime.UtcNow - src.LikedDate)))
                .ReverseMap();
            #endregion

            #region Mapper for Cart
            //Mapper for Cart
            CreateMap<Cart, CartVM>()
                /*.ForMember(dest => dest.Product, o => o.MapFrom(src => src.Products.Name))*/
                .ForMember(dest => dest.User, o => o.MapFrom(src => src.User.UserName))
                .ReverseMap();
            #endregion

            #region Mapper for Blogs
            //Mapper for Blogs
            CreateMap<Blog, BlogVM>().ReverseMap();
            CreateMap<Blog, BlogDTO>().ReverseMap();
            #endregion

            #region Mapper for Trash
            CreateMap<Product, TrashVM>()
                .ForMember(dest => dest.IdProduct, o => o.MapFrom(src => src.Id))
                .ReverseMap();
            CreateMap<Post, TrashVM>()
                .ForMember(dest => dest.IdPost, o => o.MapFrom(src => src.Id))
                .ReverseMap();

            #endregion

            #region Mapper for UserAction
            CreateMap<UserAction, UserActionsVM>()
                .ForMember(dest => dest.UserName, o => o.MapFrom(src => src.User.UserName))
                .ReverseMap();
            #endregion

            #region Mapper for Order
            CreateMap<OrderDTO, Order>().ReverseMap();

            CreateMap<Order, OrderVM>()
                /*.ForMember(dest => dest.User, o => o.MapFrom(src => src.User))
                .ForMember(dest => dest.OrderUpdates, o => o.MapFrom(src => src.OrderUpdates))*/
                .ReverseMap();

            CreateMap<OrderDetail, OrderDetailVM>().ReverseMap();
            CreateMap<OrderUpdate, OrderUpdateVM>()
                .ForMember(dest => dest.CodeOrder, o => o.MapFrom(src => src.Order.Code))
                .ReverseMap();

            CreateMap<OrderDetailDTO, OrderDetail>().ReverseMap();
            CreateMap<Cart, OrderDetailDTO>().ReverseMap();
            #endregion

            #region Mapper for Notification
            CreateMap<Notification, NotificationDTO>().ReverseMap();
            CreateMap<UserNotification, NotificationVM>()
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.NotifID, o => o.MapFrom(src => src.Notification.Id))
                .ForMember(dest => dest.Icon, o => o.MapFrom(src => src.Notification.Icon))
                .ForMember(dest => dest.Content, o => o.MapFrom(src => src.Notification.Content))
                .ForMember(dest => dest.URL, o => o.MapFrom(src => src.Notification.URL))
                .ForMember(dest => dest.LastTime, o => o.MapFrom(src => DateTime.UtcNow - src.Notification.CreatedDate))
                .ReverseMap();
            #endregion
        }
    }
}
