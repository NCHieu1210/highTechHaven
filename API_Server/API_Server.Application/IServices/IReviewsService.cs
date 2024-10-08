using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IReviewsService
    {
        /// <summary>
        /// Get all reviews async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<ReviewVM>> GetAllReviewAsync();

        /// <summary>
        /// Get reviews by ProductOptionID async
        /// </summary>
        /// <param name="productOptionId"></param>
        /// <returns></returns>
        public Task<ListReviewVM> GetReviewsByProductOptionId(int productOptionId);

        /// <summary>
        /// Get ratings by product option Id async 
        /// </summary>
        /// <param name="productOptionId"></param>
        /// <returns></returns>
        public Task<double?> GetRatingByProductOptionId(int productOptionId);

        /// <summary>
        /// Get ratings by product Id async 
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<double?> GetAverageRatingByProductId(int productId);

        /// <summary>
        /// Create product reviews with token async
        /// </summary>
        /// <param name="reviewDTO"></param>
        /// <returns></returns>
        public Task<ReviewVM> CreateReviewAsync(ReviewDTO reviewDTO);

        /// <summary>
        /// Confirm reviews by reviewId async
        /// </summary>
        /// <param name="reviewId"></param>
        /// <returns></returns>
        public Task<ReviewVM> ConfirmReviewAsync(int reviewId);

        /// <summary>
        /// Delete reviews async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public  Task<ReviewVM> DeleteReviewsAsync(int id);

    }
}
