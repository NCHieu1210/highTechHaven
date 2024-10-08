using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class CartService : ICartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Cart> _cartsRP;
        private readonly IGenericRepository<Product> _productsRP;
        private readonly IGenericRepository<ProductVariant> _productsVariantRP;
        private readonly IIncludeWithUser<Cart> _includeWithUser;
        private readonly IProductExpansionsService _productExpansionsService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public CartService(IUnitOfWork unitOfWork, IProductExpansionsService productExpansionsService,
            IHttpContextAccessor httpContextAccessor, IMapper mapper) {
            _unitOfWork  = unitOfWork;
            _cartsRP = _unitOfWork.RepositoryCarts;
            _productsRP = _unitOfWork.RepositoryProducts;
            _productsVariantRP = _unitOfWork.RepositoryProductVariants;
            _includeWithUser = _unitOfWork.IncludeCartWithUser;
            _productExpansionsService = productExpansionsService;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        public async Task<string> AddToCartAsync(AddToCartDTO addToCartDTO)
        {
            var userId =  _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var productVariant = await _productsVariantRP.GetAsync(addToCartDTO.ProductVariantID);
            if (productVariant == null)
            {
                return null;
            }

            // Check if the product is already in the cart
            var existingCartItem = await _cartsRP.GetAsync(c => c.UserID == userId && c.ProductVariantID == addToCartDTO.ProductVariantID);
            if (existingCartItem != null)
            {
                // Update the quantity if the product is already in the cart
                existingCartItem.Quantity += addToCartDTO.Quantity;
                await _cartsRP.UpdateAsync(existingCartItem.Id, existingCartItem);
            }
            else
            {
                // Add new cart item
                var cart = new Cart
                {
                    UserID = userId,
                    ProductVariantID = addToCartDTO.ProductVariantID,
                    Quantity = addToCartDTO.Quantity
                };
                await _cartsRP.CreateAsync(cart);
            }

            await _unitOfWork.SaveChangesAsync();
            return "Product added to cart successfully";
        }


        /// <summary>
        /// Reduce quantity product in cart async
        /// </summary>
        /// <param name="addToCartDTO"></param>
        /// <returns></returns>
        public async Task<string> ReduceQuantityAsync(AddToCartDTO addToCartDTO)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var existingCartItem = await _cartsRP.GetAsync(c => c.UserID == userId && c.ProductVariantID == addToCartDTO.ProductVariantID);

            if (existingCartItem == null)
            {
                return null;
            }

            if (existingCartItem.Quantity <= addToCartDTO.Quantity)
            {
                await _unitOfWork.RepositoryCarts.DeleteAsync(existingCartItem.Id);
            }
            else
            {
                existingCartItem.Quantity -= addToCartDTO.Quantity;
                await _unitOfWork.RepositoryCarts.UpdateAsync(existingCartItem.Id, existingCartItem);
            }

            await _unitOfWork.SaveChangesAsync();
            return "Product quantity reduced successfully!";
        }

        /// <summary>
        /// Get cart by token cart async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<CartVM>> GetCartByTokenCartAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var carts = await _cartsRP.GetICollectionAsync(c => c.UserID == userId);
            if(carts.Count == 0)
            {
                return new List<CartVM>();
            }
            /*carts = await _includeWithUser.GetGenericWithUserAsync(carts.Select(c => c.Id).ToList());*/
            carts = await _cartsRP.IncludeEntities(carts.Select(c => (object)c.Id).ToList(),
                                                         c => c.ProductVariant.ProductOption.Product,
                                                         c => c.ProductVariant.ProductImage,
                                                         c => c.ProductVariant.ProductOption.ProductOptionType,
                                                         c => c.ProductVariant.ProductColor);

            var cartsVM = _mapper.Map<ICollection<CartVM>>(carts);
            return cartsVM;
        }

    }
}
