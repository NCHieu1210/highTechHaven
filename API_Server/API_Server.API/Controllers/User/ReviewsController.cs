using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.IServices;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : BaseController
    {
        private readonly IReviewsService _reviewsService;

        public ReviewsController(IReviewsService reviewsService) {
            _reviewsService = reviewsService;

        }

        /// <summary>
        /// Get all review
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllReview()
        {
            return await HandleGetRequestAsync(() => _reviewsService.GetAllReviewAsync(), result => result != null);
        }

        /// <summary>
        /// Get reviews by ProductOptionID  async
        /// </summary>
        /// <returns></returns>
        [HttpGet("{productOptionId}")]
        public async Task<IActionResult> GetReviewsByProductOptionId(int productOptionId)
        {
            return await HandleGetRequestAsync(() => _reviewsService.GetReviewsByProductOptionId(productOptionId), result => result != null);
        }

        /// <summary>
        /// Create review with token
        /// </summary>
        /// <param name="reviewDTO"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = UserRole.Customer)]
        public async Task<IActionResult> CreateReview(ReviewDTO reviewDTO)
        {
            return await HandleCreateRequestAsync(()=> _reviewsService.CreateReviewAsync(reviewDTO), result => result != null);
        }

    }
}
