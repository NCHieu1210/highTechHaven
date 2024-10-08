using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Server.API.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class ProductsController : BaseController
    {
        private readonly IProductsService _productsService;

        /// <summary>
        /// Dependency Injection IProductsService
        /// </summary>
        /// <param name="productsService"></param>
        public ProductsController(IProductsService productsService)
        {
            _productsService = productsService;
        }

        /// <summary>
        /// Get all product
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}, {UserRole.StoreManager}")]
        public async Task<IActionResult> GetProductsAllByAdmin()
        {
            return await HandleGetRequestAsync(() => _productsService.GetAllProductsByAdminAsync(), result => result.Count > 0);
        }


        /// <summary>
        /// Create a product
        /// </summary>
        /// <param name="productDTO"></param>
        /// <param name="variantDTOs"></param>
        /// <param name="imageDTOs"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> CreateProductTestAsync(
            [FromForm] ProductDTO productDTO,
            [FromForm] ICollection<ProductVariantDTO> variantDTOs,
            [FromForm] ProductImageDTO imageDTOs)
        {
            return await HandleCreateRequestAsync(() => _productsService.CreateProductAsync(productDTO, variantDTOs, imageDTOs),
                                                   result => result != null);
        }

        /// <summary>
        /// Create a product
        /// </summary>
        /// <param name="productDTO"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> UpdateProductAsync(
            int id, 
            [FromForm] ProductDTO productDTO,
            [FromForm] ICollection<ProductVariantDTO> variantDTOs,
            [FromForm] ProductImageDTO imageDTOs)
        {
            return await HandleUpdateRequestAsync(() => _productsService.UpdateProductAsync(id, productDTO, variantDTOs, imageDTOs), result => result != null);
        }

        [HttpPut("change-product-status/{productId}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.StoreManager}")]
        public async Task<IActionResult> ChangeProductStatusAsync(int productId) 
        { 
            return await HandleUpdateRequestAsync(() => _productsService.ChangeProductStatusAsync(productId), result => result != null);
        }

        /// <summary>
        /// Delete a poduct
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            try
            {
                var result = await _productsService.DeleteProductAsync(id);
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
        /// Delete a range products by lamda expresssion lambda
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("delete-range")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteRangeAsync(List<int> idsToDelete)
        {
            try
            {
                var result = await _productsService.DeleteProductsRangeAsync(idsToDelete);
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

        [HttpDelete("permanently-deleted/{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> PermanentlyDeleted(int id)
        {
            return await HandleDeleteRequestAsync(() => _productsService.PermanentlyProductDeleted(id), result => result != null);
        }

        /// <summary>
        /// Restore a product async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("restore/{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> RestoreAsync(int id)
        {
            return await HandleRestoreRequestAsync(() => _productsService.RestoreProductAsync(id), result => result != null);
        }

        /// <summary>
        /// Restore range products by lambda async
        /// </summary>
        /// <param name="idToRestore"></param>
        /// <returns></returns>
        [HttpPost("restore-range")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> RestoreRangeAsync(List<int> idToRestore)
        {
            return await HandleRestoreRequestAsync(() => _productsService.RetoreRangeProductsAsync(idToRestore), result => result != null);
        }
    }
}
