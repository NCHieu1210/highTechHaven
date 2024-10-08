using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : BaseController
    {
        private readonly ICommentsService _commentsService;

        public CommentsController(ICommentsService commentsService) {
            _commentsService = commentsService;
        }

        /// <summary>
        /// Get all comments async
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public Task<IActionResult> GetAllComments()
        {
            return HandleGetRequestAsync(() => _commentsService.GetAllCommentsAync(), result => result != null);
        }

        /// <summary>
        /// Get comments by product id async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("get-by-product/{productId}")]
        public Task<IActionResult> GetByProductIdComments(int productId)
        {
            return HandleGetRequestAsync(() => _commentsService.GetCommentsByProductIdAync(productId), result => result != null);
        }

        /// <summary>
        /// Get comments by product id async
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        [HttpGet("get-by-post/{postId}")]
        public Task<IActionResult> GetByPostIdComments(int postId)
        {
            return HandleGetRequestAsync(() => _commentsService.GetCommentsByPostIdAync(postId), result => result != null);
        }

        /// <summary>
        /// Add comment
        /// </summary>
        /// <param name="commentDTO"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        public Task<IActionResult> AddComments([FromForm] CommentDTO commentDTO)
        {
            return HandleCreateRequestAsync(() => _commentsService.AddCommentAync(commentDTO), result => result != null);
        }
    }
}
