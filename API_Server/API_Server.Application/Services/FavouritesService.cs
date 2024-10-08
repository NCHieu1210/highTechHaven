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
    public class FavouritesService : IFavouritesService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Favourite> _favoriteRP;
        private readonly IGenericRepository<Product> _productRP;
        private readonly IGenericRepository<ProductOption> _productOptionRP;
        private readonly IIncludeWithUser<Favourite> _includeWithUser;
        private readonly IProductExpansionsService _productExpansionsService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FavouritesService(IMapper mapper ,IUnitOfWork unitOfWork, IProductExpansionsService productExpansionsService,
            IHttpContextAccessor httpContextAccessor
            ) {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _favoriteRP = _unitOfWork.RepositoryFavorites;
            _productRP = _unitOfWork.RepositoryProducts;
            _productOptionRP = _unitOfWork.RepositoryProductOptions;
            _includeWithUser = _unitOfWork.IncludeFavoriteWithUser;
            _productExpansionsService = productExpansionsService;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Get favorite by token async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<FavouriteVM>> GetFavouritesByTokenAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value ?? throw new Exception("User ID not found in token!"); ;
            var existingFavorites = await _favoriteRP.GetICollectionAsync(f => f.UserID == userId);
            if (!existingFavorites.Any())
            {
                return new List<FavouriteVM>();
            } 
            existingFavorites = await _favoriteRP.IncludeEntities(existingFavorites.Select(f => (object)f.Id),
                                                                  f => f.ProductOption,
                                                                  f => f.ProductOption.Product);
            return _mapper.Map<ICollection<FavouriteVM>>(existingFavorites);
        }

        /// <summary>
        /// Check if the product is in the favorites list by token async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async Task<bool> CheckFavouritesByTokenAsync(int productOptionId)
        {
            var userId = (_httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value) ?? throw new Exception("User ID not found in token!");
            var existingFavorites = await _favoriteRP.GetICollectionAsync(f => f.UserID == userId) ?? throw new Exception("There are no products in favorites.");
            if (existingFavorites == null || !existingFavorites.Any())
            {
                throw new Exception("There are no products in favorites!");
            }
            var isFavorite = existingFavorites.Any(f => f.ProductOptionID == productOptionId);
            return isFavorite;
        }

        /// <summary>
        /// Add a product to favorite async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<Favourite> AddToFavouritesAsync(int productOptionId)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value ?? throw new Exception("User ID not found in token!");

            var existingFavorite = await _favoriteRP.GetAsync(f => f.UserID == userId && f.ProductOptionID == productOptionId);

            if (existingFavorite != null)
            {
                throw new Exception("Product option is already in the favorites list.");
            }

            var favorite = new Favourite
            {
                UserID = userId,
                ProductOptionID = productOptionId,
                DateAdded = DateTime.UtcNow
            };

            await _favoriteRP.CreateAsync(favorite);
            await _unitOfWork.SaveChangesAsync();
            return favorite;
        }

        /// <summary>
        /// Remove a product form  favorite async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<Favourite> RemoveFromFavouritesAsync(int productOptionId)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value ?? throw new Exception("User ID not found in token!"); ;
            var existingFavorite = await _favoriteRP.GetAsync(f => f.UserID == userId && f.ProductOptionID == productOptionId) ?? throw new Exception("Product is not in the favorites list.");
            await _favoriteRP.DeleteAsync(existingFavorite.Id);
            await _unitOfWork.SaveChangesAsync();
            return existingFavorite;
        }
    }
}
