using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class CommentsService : ICommentsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Comment> _commnetRP;
        private readonly ILikedService _likedService;
        private readonly INotificationsService _notificationsService;
        private readonly IAuthRepository _authRepository;
        private readonly IUsersRepository _usersRP;
        private readonly IProductsService _productsService;
        private readonly IPostsService _postsService;
        private readonly IIncludeWithUser<Comment> _includeWithUser;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public CommentsService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor,
            ILikedService likedService, INotificationsService notificationsService, IAuthRepository authRepository,
            IProductsService productsService, IUsersRepository usersRepository) 
        {
            _unitOfWork = unitOfWork;
            _commnetRP = _unitOfWork.RepositoryComments;
            _likedService = likedService;
            _notificationsService = notificationsService;
            _authRepository = authRepository;
            _usersRP = usersRepository;
            _productsService = productsService;
            _includeWithUser = _unitOfWork.IncludeCommentWithUser;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        /// <summary>
        /// Get all comments async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<CommentVM>> GetAllCommentsAync()
        {
            var comments = await _commnetRP.GetAsync();
            var includeComments = new List<Comment>();
            foreach (var comment in comments) {
                var includeComment = await _commnetRP.IncludeEntity(comment.Id, c => c.Product, c => c.Post);
                includeComment = await _includeWithUser.GetGenericWithUserAsync(comment.Id);
                if (comment.ParentCommentID == null)
                {
                    includeComments.Add(includeComment);
                }
            }
            var commentVMs = _mapper.Map<ICollection<CommentVM>>(includeComments);

            // Calculate quantity liked for CommentVM
            foreach (var commentVM in commentVMs)
            {
                commentVM.QuantityLiked = await _likedService.GetQuantityLikedByCommentAsync(commentVM.Id);
                commentVM.User.IsCustomer = !(await _authRepository.CheckRolesByUserIdAsync(commentVM.User.Id, new List<string> {
                                                                                                             UserRole.Admin,
                                                                                                             UserRole.StoreManager,
                                                                                                             UserRole.Marketing}));
                if (commentVM.SubComments.Count > 0)
                {
                    foreach (var subCommentVM in commentVM.SubComments)
                    {
                        subCommentVM.QuantityLiked = await _likedService.GetQuantityLikedByCommentAsync(subCommentVM.Id);
                        subCommentVM.User.IsCustomer = !(await _authRepository.CheckRolesByUserIdAsync(subCommentVM.User.Id, new List<string> {
                                                                                                                   UserRole.Admin,
                                                                                                                   UserRole.StoreManager,
                                                                                                                   UserRole.Marketing}));
                    }
                }
            }
            return commentVMs;
        }

        /// <summary>
        /// Get collection comments by product id  aync
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async Task<ICollection<CommentVM>> GetCommentsByProductIdAync(int productId)
        {
            var comments = await _commnetRP.GetICollectionAsync(pID => pID.ProductID == productId);
            var includeComments = new List<Comment>();
            foreach (var comment in comments)
            {
                var includeComment = await _commnetRP.IncludeEntity(comment.Id);
                includeComment = await _includeWithUser.GetGenericWithUserAsync(comment.Id);
                if (comment.ParentCommentID == null)
                {
                    includeComments.Add(includeComment);
                }
            }
            var commentVMs = _mapper.Map<ICollection<CommentVM>>(includeComments);

            // Calculate quantity liked for CommentVM
            foreach (var commentVM in commentVMs)
            {
                commentVM.QuantityLiked = await _likedService.GetQuantityLikedByCommentAsync(commentVM.Id);
                if (commentVM.SubComments.Count > 0)
                {
                    foreach (var subCommentVM in commentVM.SubComments)
                    {
                        subCommentVM.QuantityLiked = await _likedService.GetQuantityLikedByCommentAsync(subCommentVM.Id);
                        subCommentVM.User.IsCustomer = !(await _authRepository.CheckRolesByUserIdAsync(subCommentVM.User.Id, new List<string> {
                                                                                                                   UserRole.Admin,
                                                                                                                   UserRole.StoreManager,
                                                                                                                   UserRole.Marketing}));
                    }
                }
                commentVM.User.IsCustomer = !(await _authRepository.CheckRolesByUserIdAsync(commentVM.User.Id,new List<string> {
                                                                                                                  UserRole.Admin,
                                                                                                                  UserRole.StoreManager,
                                                                                                                  UserRole.Marketing}));
            }
            return commentVMs;
        }

        /// <summary>
        /// Get collection comments by post id aync
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        public async Task<ICollection<CommentVM>> GetCommentsByPostIdAync(int postId)
        {
            var comments = await _commnetRP.GetICollectionAsync(pID => pID.PostID == postId);
            var includeComments = new List<Comment>();
            foreach (var comment in comments)
            {
                var includeComment = await _commnetRP.IncludeEntity(comment.Id);
                includeComment = await _includeWithUser.GetGenericWithUserAsync(comment.Id);
                if (comment.ParentCommentID == null)
                {
                    includeComments.Add(includeComment);
                }
            }
            var commentVMs = _mapper.Map<ICollection<CommentVM>>(includeComments);

            // Calculate quantity liked for CommentVM
            foreach (var commentVM in commentVMs)
            {
                commentVM.QuantityLiked = await _likedService.GetQuantityLikedByCommentAsync(commentVM.Id);
                if (commentVM.SubComments.Count > 0)
                {
                    foreach (var subCommentVM in commentVM.SubComments)
                    {
                        subCommentVM.QuantityLiked = await _likedService.GetQuantityLikedByCommentAsync(subCommentVM.Id);
                        subCommentVM.User.IsCustomer = !(await _authRepository.CheckRolesByUserIdAsync(subCommentVM.User.Id, new List<string> {
                                                                                                                   UserRole.Admin,
                                                                                                                   UserRole.StoreManager,
                                                                                                                   UserRole.Marketing}));
                    }
                }
                commentVM.User.IsCustomer = !(await _authRepository.CheckRolesByUserIdAsync(commentVM.User.Id, new List<string> {
                                                                                                                   UserRole.Admin,
                                                                                                                   UserRole.StoreManager,
                                                                                                                   UserRole.Marketing}));
            }
            return commentVMs;
        }

        /// <summary>
        /// Add comment async
        /// </summary>
        /// <param name="commentDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<CommentVM> AddCommentAync(CommentDTO commentDTO)
        {
            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    //STEP 1: Create comment
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
                    if (commentDTO.ProductID == null && commentDTO.PostID == null)
                    {
                        throw new Exception("Invalid data!");
                    }
                    var comment = _mapper.Map<Comment>(commentDTO);
                    comment.UserID = userId;

                    await _commnetRP.CreateAsync(comment);
                    await _unitOfWork.SaveChangesAsync();

                    //STEP 2: Create nitification
                    var user = await _usersRP.GetAsync(comment.UserID);
                    NotificationDTO notification = new NotificationDTO();

                    string url = "";
                    string name = "";
                    string areas = "";

                    if (comment.ProductID != null)
                    {
                        int productId = comment.ProductID.Value;
                        var product = await _productsService.GetProductByIdAsync(productId);
                        url = $"/products/{product.Slug}?option={product.ProductVariants.Option}";
                        name = product.Name;
                        areas = "sản phẩm";
                    }
                    else
                    {
                        var post = (await _commnetRP.IncludeEntity(comment.Id, c => c.Post)).Post;
                        url = $"/post/{post.Slug}";
                        name = post.Name;
                        areas = "bài viết";
                    }

                    //If the comment is newly created
                    if (commentDTO.ParentCommentID == null)
                    {
                        notification.Icon = user.Avatar;
                        notification.Content = $"<strong>{user.FirstName} {user.LastName}</strong> đã bình luận về {areas} " +
                            $"<strong><em>{name}</strong></em>: {comment.Content}";
                        notification.UserRequestID = user.Id;
                        notification.URL = "/comments";
                        await _notificationsService.CreateNotificationAsync(notification, new List<string>() { UserRole.Admin, UserRole.StoreManager, UserRole.Marketing});
                    }

                    //If the comment is a sub comment
                    else
                    {
                        int prentCommentID = comment.ParentCommentID.Value;
                        var userParentCommnent = (await _includeWithUser.GetGenericWithUserAsync(prentCommentID)).User;
                        var roles = new List<string>();

                        var isCustomer = !await _authRepository.CheckRolesByUserIdAsync(user.Id, new List<string> {
                                                                                                    UserRole.Admin,
                                                                                                    UserRole.StoreManager,
                                                                                                    UserRole.Marketing});

                        notification.Icon = user.Avatar;
                        notification.UserRequestID = user.Id;

                        if (isCustomer && userParentCommnent.Id != user.Id)
                        {
                            notification.Content = $"Xin chào {userParentCommnent.FirstName} {userParentCommnent.LastName}! " +
                                $"<strong>{user.FirstName} {user.LastName}</strong> đã phản hồi bình luận của bạn: {comment.Content} ";
                            notification.UserResponseID = userParentCommnent.Id;
                            notification.URL = url;

                            var notificationToAdmin = new NotificationDTO()
                            {
                                Icon = user.Avatar,
                                UserRequestID = user.Id,
                                Content = $"<strong>{user.FirstName} {user.LastName}</strong> đã phản hồi bình luận của " +
                                          $"{userParentCommnent.FirstName} {userParentCommnent.LastName} về {areas} " +
                                          $"<strong><em>{name}</strong></em>: {comment.Content}",
                                URL = "/comments",
                            };
                            await _notificationsService.CreateNotificationAsync(notificationToAdmin, new List<string>() { UserRole.Admin, UserRole.StoreManager, UserRole.Marketing });

                        }
                        else if (isCustomer && userParentCommnent.Id == user.Id)
                        {
                            notification.Content = $"<strong>{user.FirstName} {user.LastName}</strong> đã phản hồi bình luận về {areas} " +
                                                   $"<strong><em>{name}</strong></em>: {comment.Content}";
                            notification.URL = "/comments";
                            roles.AddRange(new[] { UserRole.Admin, UserRole.Marketing, UserRole.StoreManager });
                        }
                        else {
                            notification.Content = $"Xin chào {userParentCommnent.FirstName} {userParentCommnent.LastName}! " +
                                $"<strong>{user.FirstName} {user.LastName}</strong> đã phản hồi bình luận của bạn: {comment.Content} ";
                            notification.UserResponseID = userParentCommnent.Id;
                            notification.URL = url;
                        }
                        
                        await _notificationsService.CreateNotificationAsync(notification, roles);
                    }
                    await _unitOfWork.CommitTransactionAsync();
                    return _mapper.Map<CommentVM>(comment);
                }
                catch (Exception ex) {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }

            }
                
        }
    }
}
