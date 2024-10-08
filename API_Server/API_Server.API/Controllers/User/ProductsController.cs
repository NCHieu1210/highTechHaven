using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain;
using API_Server.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : BaseController
    {
        private readonly IProductsService _productsService;

        public ProductsController(IProductsService productsService)
        {
            _productsService = productsService;
        }

        /// <summary>
        /// GetAll products async
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            return await HandleGetRequestAsync(() => _productsService.GetAllProductsByCustumerAsync(), result => result != null);
        }

        /// <summary>
        /// Get a product by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductByIdAsync(id), result => result != null);
        }

        /// <summary>
        /// Get a product by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("get-by-variant-id/{id:int}")]
        public async Task<IActionResult> GetByProductVariantIdAsync(int id)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductByVariantIdAsync(id), result => result != null);
        }

        /// <summary>
        /// Get a product by product option id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("get-by-product-option-ids")]
        public async Task<IActionResult> GetCollectionProductByProductOptionIdAsync([FromQuery] List<int> id)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductByCollectionProductOptionIdAsync(id), result => result != null);
        }

        /// <summary>
        /// Get a product by slug
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlugAsync(string slug)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductBySlugAsync(slug), result => result != null);
        }

        /// <summary>
        /// Get a product by slug combined with options product and color async
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        [HttpGet("variant/{slug}")]
        public async Task<IActionResult> GetVariantBySlugAsync(string slug, [FromQuery] string option, [FromQuery] string color)
        {
            return await HandleGetRequestAsync(() => _productsService.GetVariantBySlugAsync(slug, option, color), result => result != null);
        }

        /// <summary>
        /// Get by range categories async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpGet("range-categories")]
        public async Task<IActionResult> GetByRangeCategoriesAsync([FromQuery] List<int> ids)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductsByRangeCategoriesAsync(ids), result => result != null);
        }

        /// <summary>
        /// Get by range suppliers async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpGet("range-suppliers")]
        public async Task<IActionResult> GetByRangeSuppliersAsync([FromQuery] List<int> ids)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductsByRangeSuppliersAsync(ids), result => result != null);
        }


        /// <summary>
        /// Get by range categories and suppliers async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpGet("range-categories-and-suppliers")]
        public async Task<IActionResult> GetRangeCategoriesAndSuppliersAsync([FromQuery] List<int> idsCategory, [FromQuery] List<int> idsSupplier)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductsByRangeCategoriesAndSuppliersAsync(idsCategory, idsSupplier), result => result != null);
        }

        /// <summary>
        /// Get products by search
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpGet("search")]
        public async Task<IActionResult> GetBySearchAsync(string search)
        {
            return await HandleGetRequestAsync(() => _productsService.GetProductsBySearchAsync(search), result => result != null);
        }
    }
}
