using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
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
    public class BlogsController : BaseController
    {
        private readonly IBlogsService _blogsService;

        public BlogsController(IBlogsService blogsService)
        {
            _blogsService = blogsService;
        }

        /// <summary>
        /// create a blog
        /// </summary>
        /// <param name="blogDTO"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> CreateAsync([FromForm] BlogDTO blogDTO)
        {
            return await HandleCreateRequestAsync(() => _blogsService.CreateAsync(blogDTO), result => result != null);
        }

        /// <summary>
        /// update a blog
        /// </summary>
        /// <param name="blogDTO"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> UpdateAsync(int id, BlogDTO blogDTO)
        {
            return await HandleUpdateRequestAsync(() => _blogsService.UpdateAsync(id, blogDTO), result => result != null);
        }

        /// <summary>
        /// delete a blog
        /// </summary>
        /// <param name="blogDTO"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            return await HandleDeleteRequestAsync(() => _blogsService.DeleteAsync(id), result => result != null);
        }

        /// <summary>
        /// Delete a range suppliers by lamda expresssion lambda
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("delete-range")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteRangeAsync(List<int> idsToDelete)
        {
            return await HandleDeleteRequestAsync(() => _blogsService.DeleteRangeAsync(idsToDelete), result => result != null);
        }

    }
}
