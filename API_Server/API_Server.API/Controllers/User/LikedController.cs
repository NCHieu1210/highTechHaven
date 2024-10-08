using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikedController : BaseController
    {
        private readonly ILikedService _likedService;

        public LikedController (ILikedService likedService)
        {
            _likedService = likedService;
        }

        /// <summary>
        /// Like or Unlike a comment async
        /// </summary>
        /// <returns></returns>
        [HttpPost("comments/{commentId}")]
        [Authorize]
        public async Task<IActionResult> HandleLikeCommentAsync(int commentId)
        {
            try
            {
                await _likedService.HandleLikeCommentAsync(commentId);
                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "successful action!",
                    Data = "",
                });
            }
            catch (Exception ex)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = "",
                });
            };
        }

        /// <summary>
        /// Like or Unlike a comment async
        /// </summary>
        /// <returns></returns>
        [HttpPost("posts/{postId}")]
        [Authorize]
        public async Task<IActionResult> HandleLikePostAsync(int postId)
        {
            try
            {
                await _likedService.HandleLikePostAsync(postId);
                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "successful action!",
                    Data = "",
                });
            }
            catch (Exception ex)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = "",
                });
            };
        }

        /// <summary>
        /// Get all liked comments
        /// </summary>
        /// <returns></returns>
        [HttpGet("comments")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}, {UserRole.StoreManager}")]
        public  async Task<IActionResult> GetAllLikedComments()
        {
            return await HandleGetRequestAsync( () => _likedService.GetAllLikedAsync(), result => result != null);
        }

        /// <summary>
        ///  Get liked a comment by token
        /// </summary>
        /// <returns></returns>
        [HttpGet("comments/get-by-token")]
        [Authorize]
        public async Task<IActionResult> GetLikedCommentsByTokenAsync()
        {
            return await HandleGetRequestAsync(() => _likedService.GetLikedCommentsByTokenAsync(), result => result != null);
        }

        /// <summary>
        ///  Get liked a post by token
        /// </summary>
        /// <returns></returns>
        [HttpGet("posts/get-by-token")]
        [Authorize]
        public async Task<IActionResult> GetLikedPostByTokenAsync()
        {
            return await HandleGetRequestAsync(() => _likedService.GetLikedPostsByTokenAsync(), result => result != null);
        }
    }
}
