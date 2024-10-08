using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Server.API.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class CategoriesController : BaseController
    {
        private readonly ICategoriesService _categoriesService;

        /// <summary>
        ///  Injection ICategoriesService and IMapper
        /// </summary>
        /// <param name="categoriesService"></param>
        /// <param name="mapper"></param>
        public CategoriesController(ICategoriesService categoriesService)
        {
            _categoriesService = categoriesService;
        }

        [HttpGet("get-by-admin")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}, {UserRole.StoreManager}")]
        public async Task<IActionResult> GetAllByAdmin()
        {
            return await HandleCreateRequestAsync(() => _categoriesService.GetAllByAdminAsync(), result => result != null);
        }

        /// <summary>
        /// Create a category
        /// </summary>
        /// <param name="categoryDTO"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> CreateAsync([FromForm] CategoryDTO categoryDTO)
        {
            return await HandleCreateRequestAsync(() => _categoriesService.CreateAsync(categoryDTO), result => result != null);
        }

        /// <summary>
        /// Update a category
        /// </summary>
        /// <param name="id"></param>
        /// <param name="categoryDTO"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromForm] CategoryDTO categoryDTO)
        {
            return await HandleUpdateRequestAsync(() => _categoriesService.UpdateAsync(id, categoryDTO), result => result != null);
        }

        /// <summary>
        /// Delete a category
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            return await HandleDeleteRequestAsync(() => _categoriesService.DeleteAsync(id), result => result != null);
        }

        /// <summary>
        /// Delete a range suppliers by lamda expresssion lambda
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        [HttpDelete("delete-range")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteRangeAsync(List<int> idsToDelete)
        {
            return await HandleDeleteRequestAsync(() => _categoriesService.DeleteRangeAsync(idsToDelete), result => result != null);
        }

    }
}
