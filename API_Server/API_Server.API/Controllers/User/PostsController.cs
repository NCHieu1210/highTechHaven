using API_Server.API.Controllers.Base;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : BaseController
    {
        private readonly IPostsService _postsService;

        /// <summary>
        /// Dependency Injection IPostsService
        /// </summary>
        /// <param name="postsService"></param>
        public PostsController(IPostsService postsService)
        {
            _postsService = postsService;
        }

        /// <summary>
        /// GetAll posts async
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            return await HandleGetRequestAsync(() => _postsService.GetAllAsync(), result => result != null);
        }

        /// <summary>
        /// Get a post by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            return await HandleGetRequestAsync(() => _postsService.GetByIdAsync(id), result => result != null);
        }

        /// <summary>
        /// Get a post by slug
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlugAsync(string slug)
        {
            return await HandleGetRequestAsync(() => _postsService.GetBySlugAsync(slug), result => result != null);
        }

        /// <summary>
        /// Get post by search
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpGet("search")]
        public async Task<IActionResult> GetBySearchAsync(string search)
        {
            return await HandleGetRequestAsync(() => _postsService.GetBySearchAsync(search), result => result != null);
        }

        /// <summary>
        /// Get blogs async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        /*[HttpGet("blog")]
        public async Task<IActionResult> GetByBlogsAsync(int blogID)
        {
            return await HandleGetRequestAsync(() => _postsService.GetByBlogsAsync(blogID), result => result != null);
        }*/
    }
}
