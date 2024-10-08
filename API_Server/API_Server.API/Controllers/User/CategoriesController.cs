using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using API_Server.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
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

        /// <summary>
        /// Get all categories
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            return await HandleGetRequestAsync(() => _categoriesService.GetAllAsync(), result => result != null);
        }

        /// <summary>
        /// Get a category by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            return await HandleGetRequestAsync(() => _categoriesService.GetByIdAsync(id), result => result != null);
        }

        /// <summary>
        /// Get a category by slug
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlugAsync(string slug)
        {
            return await HandleGetRequestAsync(() => _categoriesService.GetBySlugAsync(slug), result => result != null);
        }

    }
}
