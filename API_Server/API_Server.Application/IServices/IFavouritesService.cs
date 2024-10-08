using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IFavouritesService
    {
        /// <summary>
        /// Get products by token async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<FavouriteVM>> GetFavouritesByTokenAsync();

        /// <summary>
        /// Check if the product is in the favorites list by token async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<bool> CheckFavouritesByTokenAsync(int productOptionId);


        /// <summary>
        /// Add a product to favorite async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<Favourite> AddToFavouritesAsync(int productOptionId);

        /// <summary>
        /// Remove a product form  favorite async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<Favourite> RemoveFromFavouritesAsync(int productOptionId);
    }
}
