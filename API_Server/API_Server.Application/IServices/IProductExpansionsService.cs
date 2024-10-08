using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IProductExpansionsService
    {
        /// <summary>
        /// Get a product variant by Id async
        /// </summary>
        /// <param name="productVariantId"></param>
        /// <returns></returns>
        public Task<ProductVariant> GetProductVariantByIdAsync(int productVariantId);

        /// <summary>
        /// Get product variants by collection Id async
        /// </summary>
        /// <param name="productVariantId"></param>
        /// <returns></returns>
        public Task<ICollection<ProductVariant>> GetProductVariantByIdAsync(ICollection<int> productVariantId);

        /// <summary>
        /// Get variants by productID async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<ICollection<ProductVariant>> GetVariantsByProductIdAsync(int productId);

        /// <summary>
        /// Get variants by ProductOptionID async
        /// </summary>
        /// <param name="productOptionId"></param>
        /// <returns></returns>
        public Task<ICollection<ProductVariantDetailVM>> GetVariantsByProductOptionIdAsync(int productOptionId);

        /// <summary>
        /// Create a new option if the option doesn't exst, if it exists do nothing (Async)
        /// </summary>
        /// <param name="option"></param>
        /// <returns></returns>
        public Task<ProductOptionType> CreateProductOptionAsync(string option);

        /// <summary>
        /// Create a new color if the color doesn't exst, if it exists do nothing (Async)
        /// </summary>
        /// <param name="color"></param>
        /// <returns></returns>
        public Task<ProductColor> CreateProductColorAsync(string color);

        /// <summary>
        /// Create ProductVariants async
        /// </summary>
        /// <param name="variantDTOs"></param>
        /// <param name="product"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task CreateProductVariantsAsync(Product product, ICollection<ProductVariantDTO> variantDTOs);

        /// <summary>
        /// Create related product images async
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="productImageDTO"></param>
        /// <returns></returns>
        public Task CreateProductImageAsync(int productId, ProductImageDTO productImageDTO);

        /// <summary>
        /// Update related product images async
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="productImageDTO"></param>
        /// <returns></returns>
        public Task UpdateProductImageAsync(int productId, ProductImageDTO productImageDTO);

        /// <summary>
        /// Update produc status by product id async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task UpdateProductStatusAsync(int productId);

        /// <summary>
        /// Update ProductVariants async
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="variantDTOs"></param>
        /// <param name="product"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task UpdateProductVariantsAsync(Product product, ICollection<ProductVariantDTO> variantDTOs);

        ///// <summary>
        /// Delete product variants by ProductID collection async
        /// </summary>
        /// <param name="variantDTOs"></param>
        /// <param name="product"></param>
        /// <param name="userId"></param>
        /// <returns></returns>v
        public Task DeleteVariantsByProductIdAsync(int productIds);
    }
}
