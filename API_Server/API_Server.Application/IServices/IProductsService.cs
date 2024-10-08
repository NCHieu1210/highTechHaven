using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IProductsService
    {
        #region Interface products

        /// <summary>
        /// Get all products by custumer role async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> GetAllProductsByCustumerAsync();

        /// <summary>
        /// Get all products by admin role async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> GetAllProductsByAdminAsync();

        /// <summary>
        /// Get a product by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<ProductsVM> GetProductByIdAsync(int id);

        /// <summary>
        /// Get a product by variant id async
        /// </summary>
        /// <param name="productVariantId"></param>
        /// <returns></returns>
        public Task<ProductsVM> GetProductByVariantIdAsync(int productVariantId);

        /// <summary>
        /// Get a product by slug async
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public Task<ProductDetailVM> GetProductBySlugAsync(string slug);

        /// <summary>
        /// Get collection products by product option id async
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> GetProductByCollectionProductOptionIdAsync(List<int> productOptionId);

        /// <summary>
        /// Get a product by slug combined with options product and color async
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="option"></param>
        /// <param name="color"></param>
        /// <returns></returns>
        public Task<ProductVariantBySlugVM> GetVariantBySlugAsync(string slug, string option, string color);

        /// <summary>
        /// Get by range categories async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> GetProductsByRangeCategoriesAsync(List<int> ids);

        /// <summary>
        /// Get by range suppliers async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> GetProductsByRangeSuppliersAsync(List<int> ids);

        /// <summary>
        /// Get by range categories and suppliers async
        /// </summary>
        /// <param name="idsCategories"></param>
        /// <param name="idsSupplies"></param>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> GetProductsByRangeCategoriesAndSuppliersAsync(List<int> idsCategories, List<int> idsSupplies);

        /// <summary>
        /// Get products by search async
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> GetProductsBySearchAsync(string search);

        /// <summary>
        /// Change product status by id async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<ProductsVM> ChangeProductStatusAsync(int productId);

        /// <summary>
        /// Create a product async
        /// </summary>
        /// <param name="productDTO"></param>
        /// <param name="optionDTOs"></param>
        /// <param name="variantDTOs"></param>
        /// <param name="images"></param>
        /// <returns></returns>
        public Task<ProductsVM> CreateProductAsync(
            ProductDTO productDTO,
            ICollection<ProductVariantDTO> variantDTOs,
            ProductImageDTO imageDTOs);

        /// <summary>
        /// Update a product async
        /// </summary>
        /// <param name="id"></param>B
        /// <param name="productDTO"></param>
        /// <param name="variantDTOs"></param>
        /// <param name="imageDTOs"></param>
        /// <returns></returns>
        public Task<ProductsVM> UpdateProductAsync(
            int id, 
            ProductDTO productDTO,
            ICollection<ProductVariantDTO> variantDTOs,
            ProductImageDTO imageDTOs);

        /// <summary>
        /// Delete a product async 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<ProductsVM> DeleteProductAsync(int id);

        /// <summary>
        /// Delete a range of product by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> DeleteProductsRangeAsync(List<int> idsToDelete);

        /// <summary>
        /// Permanently a deleted async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<ProductsVM> PermanentlyProductDeleted(int id);

        /// <summary>
        /// Restore a product async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        public Task<ProductsVM> RestoreProductAsync(int id);

        /// <summary>
        /// Retore a range of product by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public Task<ICollection<ProductsVM>> RetoreRangeProductsAsync(List<int> idsToRestore);
        #endregion
    }
}
