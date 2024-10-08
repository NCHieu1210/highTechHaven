using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class ReviewsController : BaseController
    {
        private readonly IReviewsService _reviewsService;

        public ReviewsController(IReviewsService reviewsService) {
            _reviewsService = reviewsService;
        }

        /// <summary>
        /// Confirm reviews by reviewId async
        /// </summary>
        /// <param name="reviewDTO"></param>
        /// <returns></returns>
        [HttpPut("confirm/{reviewId}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.StoreManager}")]
        public async Task<IActionResult> ConfirmReview(int reviewId) {
            return await HandleUpdateRequestAsync(() => _reviewsService.ConfirmReviewAsync(reviewId), result => result != null);
        }

        /// <summary>
        /// Delete review with token
        /// </summary>
        /// <param name="reviewDTO"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{UserRole.Admin}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            return await HandleDeleteRequestAsync(() => _reviewsService.DeleteReviewsAsync(id), result => result != null);
        }
    }
}
