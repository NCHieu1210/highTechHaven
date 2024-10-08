using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.ISender;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class ReviewsService : IReviewsService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Review> _reviewRP;
        private readonly IGenericRepository<OrderDetail> _orderDetailRP;
        private readonly IGenericRepository<OrderUpdate> _orderUpdateRP;
        private readonly IGenericRepository<ProductOption> _productOptionRP;
        private readonly IGenericRepository<ProductVariant> _productVariantRP;
        private readonly INotificationsService _notificationsService;
        private readonly IUsersRepository _usersRP;
        private readonly IIncludeWithUser<Review> _includeWithUser;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ReviewsService(IMapper mapper, IUnitOfWork unitOfWork, INotificationsService notificationsService,
            IUsersRepository usersRepository,IHttpContextAccessor httpContextAccessor) {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _reviewRP = _unitOfWork.RepositoryReviews;
            _orderDetailRP = _unitOfWork.RepositoryOrderDetails;
            _orderUpdateRP = _unitOfWork.RepositoryOrderUpdates;
            _productOptionRP = _unitOfWork.RepositoryProductOptions;
            _productVariantRP = _unitOfWork.RepositoryProductVariants;
            _notificationsService = notificationsService;
            _usersRP = usersRepository;
            _includeWithUser = _unitOfWork.IncludeReviewWithUser;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Get all reviews async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<ReviewVM>> GetAllReviewAsync()
        {
            //Get all reviews
            var reviews = await _reviewRP.GetAsync();
            //Include reviews
            reviews = await _reviewRP.IncludeEntities(reviews.Select(r => (object)r.Id).ToList(),
                                                        r => r.ProductOption,
                                                        r => r.ProductOption.Product,
                                                        r => r.ProductOption.ProductOptionType);
            //Generate list review
            var reviewsVM = new List<ReviewVM>();
            foreach (var review in reviews)
            {
                //Include the user entity in the review
                review.User = (await _includeWithUser.GetGenericWithUserAsync(review.Id)).User;

                //Include the ProductVariants entity
                var productVariants = await _productOptionRP.IncludeEntity(review.ProductOption.Id, p => p.ProductVariants);

                //
                var defaultVariants = productVariants
                    .ProductVariants
                    .Where(pV => pV.IsDefault)
                    .ToList();

                //
                review.ProductOption.ProductVariants = defaultVariants.Any()
                    ? defaultVariants
                    : productVariants.ProductVariants.Take(1).ToList();

                //Include the ProduuctImage entity
                review.ProductOption.ProductVariants = await _productVariantRP.IncludeEntities(
                                                            review.ProductOption.ProductVariants.Select(pV => (object)pV.Id),
                                                            pV => pV.ProductImage);
                //Map data
                var reviewVM = _mapper.Map<ReviewVM>(review);
                reviewVM.ProductSlug = $"{review.ProductOption.Product.Slug}/?option={review.ProductOption.ProductOptionType.Option}";
                reviewVM.ProductName = review.ProductOption.Product.Name;
                reviewsVM.Add(reviewVM);
            };

            return reviewsVM;
        }

        /// <summary>
        /// Get reviews by ProductOptionID async
        /// </summary>
        /// <param name="productOptionId"></param>
        /// <returns></returns>
        public async Task<ListReviewVM> GetReviewsByProductOptionId(int productOptionId)
        {
            var reviews = await _reviewRP.GetICollectionAsync(rV => rV.ProductOptionID == productOptionId && rV.IsConfirmed == true);
            if(reviews.Count == 0)
            {
                return null;
            }
            reviews = await _includeWithUser.GetGenericWithUserAsync(reviews.Select(r => r.Id).ToList());
            var reviewsNumber = 0;
            var listStar = new ListStarVM();
            foreach (var review in reviews)
            {
                reviewsNumber++;
                switch (review.Rating)
                {
                    case 1: listStar.OneStar += 1; break;
                    case 2: listStar.TwoStar += 1; break;
                    case 3: listStar.ThreeStar += 1; break;
                    case 4: listStar.FourStar += 1; break;
                    case 5: listStar.FiveStar += 1; break;
                }
            }
            var reviewsVM = _mapper.Map<ICollection<ReviewVM>>(reviews);
            var listReviewsVM = new ListReviewVM()
            {
                ReviewsNumber = reviewsNumber,
                ListStar = listStar,
                Reviews = reviewsVM,
            };
            listReviewsVM.TotalRating = await GetRatingByProductOptionId(productOptionId);
            return listReviewsVM;
        }

        /// <summary>
        /// Get ratings by product option Id async 
        /// </summary>
        /// <param name="productOptionId"></param>
        /// <returns></returns>
        public async Task<double?> GetRatingByProductOptionId(int productOptionId)
        {
            var existingReview = await _reviewRP.GetICollectionAsync(rV => rV.ProductOptionID == productOptionId && rV.IsConfirmed == true);
            if (existingReview.Count > 0)
            {
                double totalStar = existingReview.Sum(rV => rV.Rating);
                return totalStar/existingReview.Count;
            }
            return null;
        }


        /// <summary>
        /// Get ratings by product Id async 
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async Task<double?> GetAverageRatingByProductId(int productId)
        {
            var productOptionIDs = (await _productOptionRP.GetICollectionAsync(pO => pO.ProductID == productId))
                                                        .Select(pO => pO.Id);

            double totalReview = 0;
            double? totalRating = 0;
            foreach (var productOptionID in productOptionIDs)
            {
                var rating = await GetRatingByProductOptionId(productOptionID);
                if(rating != null)
                {
                    totalRating += rating;
                    totalReview++;
                }    
            }    
            if(totalRating != 0)
            {
                return totalRating / totalReview;
            }    
            return null;
        }


        /// <summary>
        /// Create product reviews with token async
        /// </summary>
        /// <param name="reviewDTO"></param>
        /// <returns></returns>
        public async Task<ReviewVM> CreateReviewAsync(ReviewDTO reviewDTO)
        {
            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    var review = _mapper.Map<Review>(reviewDTO);
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

                    var existingReview = await _reviewRP.GetAsync(r => r.UserID == userId && r.ProductOptionID == reviewDTO.ProductOptionID);
                    if (existingReview != null)
                    {
                        throw new Exception("The product has been reviewed");
                    }
                    review.UserID = userId;

                    await _reviewRP.CreateAsync(review);
                    await _unitOfWork.SaveChangesAsync();

                    review = await _reviewRP.IncludeEntity(review.Id, r => r.ProductOption.ProductOptionType, r => r.ProductOption.Product);
                    var user = await _usersRP.GetAsync(userId);
                    string optionProductName = "";
                    if (review.ProductOption.ProductOptionType.Option != "No Option")
                    {
                        optionProductName = review.ProductOption.ProductOptionType.Option;
                    }
                    var notification = new NotificationDTO()
                    {
                        Icon = user.Avatar,
                        Content = $"<strong>{user.FirstName} {user.LastName}</strong> đã đánh giá sản phẩm " +
                                  $"<strong><em>{review.ProductOption.Product.Name} {optionProductName}</em></strong>" +
                                  $"({review.Rating}/5 sao)",
                        UserRequestID = userId,
                        URL = "/reviews",
                    };
                    await _notificationsService.CreateNotificationAsync(notification, new List<string>() { UserRole.Admin, UserRole.StoreManager});

                    await _unitOfWork.CommitTransactionAsync();
                    return _mapper.Map<ReviewVM>(review);

                }
                catch (Exception ex) {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }
            }
        }

        /// <summary>
        /// Confirm reviews by reviewId async
        /// </summary>
        /// <param name="reviewId"></param>
        /// <returns></returns>
        public async Task<ReviewVM> ConfirmReviewAsync(int reviewId)
        {
            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    //===STEP 1: Update review===
                    var review = await _reviewRP.GetAsync(reviewId);
                    if (review == null || review.IsConfirmed == true)
                    {
                        throw new Exception("Invalid data!");
                    }

                    review = await _includeWithUser.GetGenericWithUserAsync(review.Id);

                    review.IsConfirmed = true;

                    await _reviewRP.UpdateAsync(review.Id, review); 
                    await _unitOfWork.SaveChangesAsync();

                    //===STEP 2: Create notification===
                    //Get 
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
                    //Include the ProductVariants entity
                    review = await _reviewRP.IncludeEntity(review.Id, 
                                                           rV => rV.ProductOption.Product,
                                                           rV => rV.ProductOption.ProductOptionType);
                    review.User = (await _includeWithUser.GetGenericWithUserAsync(review.Id)).User;

                    var productVariants = await _productOptionRP.IncludeEntity(review.ProductOption.Id, p => p.ProductVariants);

                    //
                    var defaultVariants = productVariants
                        .ProductVariants
                        .Where(pV => pV.IsDefault)
                        .ToList();

                    //
                    review.ProductOption.ProductVariants = defaultVariants.Any()
                        ? defaultVariants
                        : productVariants.ProductVariants.Take(1).ToList();

                    string optionProductName = "";
                    if(review.ProductOption.ProductOptionType.Option != "No Option")
                    {
                        optionProductName = review.ProductOption.ProductOptionType.Option;
                    }    
                    var notification = new NotificationDTO()
                    {
                        Icon = "/images/users/avatarAdmin.png",
                        Content = $"Xin chào {review.User.FirstName} {review.User.LastName}! " +
                                  $"Đánh giá về sản phẩm <strong><em>{review.ProductOption.Product.Name} {optionProductName}</em></strong> " +
                                  $"của bạn đã được phê duyệt!",
                        UserRequestID = userId,
                        UserResponseID = review.User.Id,
                        URL = $"/products/{review.ProductOption.Product.Slug}?option={review.ProductOption.ProductOptionType.Option}",
                    };

                    await _notificationsService.CreateNotificationAsync(notification, new List<string>());

                    await _unitOfWork.CommitTransactionAsync();

                    return _mapper.Map<ReviewVM>(review);
                }
                catch(Exception ex)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }

            }  
        }


        /// <summary>
        /// Delete reviews async
        /// </summary>
        /// <param name="reviewDTO"></param>
        /// <returns></returns>
        public async Task<ReviewVM> DeleteReviewsAsync(int id)
        {
            var existingReviews = await _reviewRP.GetAsync(id);
            if (existingReviews == null)
            {
                return null;
            }
            else
            {
                //Update database
                await _reviewRP.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                return _mapper.Map<ReviewVM>(existingReviews);
            }
        }
    }
}
