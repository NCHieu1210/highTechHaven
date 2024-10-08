using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
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
        /// Create a post
        /// </summary>
        /// <param name="PostDTO"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> CreateAsync([FromForm] PostDTO postDTO)
        {
            return await HandleCreateRequestAsync(() => _postsService.CreateAsync(postDTO), result => result != null);
        }

        /// <summary>
        /// Create a post
        /// </summary>
        /// <param name="postDTO"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> UpdatePostAsync(int id, [FromForm] PostDTO postDTO)
        {
            return await HandleUpdateRequestAsync(() => _postsService.UpdateAsync(id, postDTO), result => result != null);
        }

        /// <summary>
        /// Delete a post
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            try
            {
                var result = await _postsService.DeleteAsync(id);
                return result != null ?
                    Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Deletion successful, data has been moved to the trash!",
                        Data = result
                    })
                    : NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "No data matching!",
                        Data = ""
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Delete a range post by lamda expresssion lambda
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("delete-range")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteRangeAsync(List<int> idsToDelete)
        {
            try
            {
                var result = await _postsService.DeleteRangeAsync(idsToDelete);
                return result != null ?
                    Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Deletion successful, data has been moved to the trash!",
                        Data = result
                    })
                    : NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "No data matching!",
                        Data = ""
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Restore a post async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("restore/{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> RestoreAsync(int id)
        {
            return await HandleRestoreRequestAsync(() => _postsService.RestorePostAsync(id), result => result != null);
        }

        /// <summary>
        /// Restore range post by lambda async
        /// </summary>
        /// <param name="idToRestore"></param>
        /// <returns></returns>
        [HttpPost("restore-range")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> RestoreRangeAsync(List<int> idToRestore)
        {
            return await HandleRestoreRequestAsync(() => _postsService.RestoreRangePostsAsync(idToRestore), result => result != null);
        }

        [HttpDelete("permanently-deleted/{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> PermanentlyDeleted(int id)
        {
            return await HandleDeleteRequestAsync(() => _postsService.PermanentlyDeleted(id), result => result != null);
        }
    }
}
