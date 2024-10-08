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
    public interface ICartService
    {
        /// <summary>
        /// Add to cart async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<string> AddToCartAsync(AddToCartDTO addToCartDTO);

        /// <summary>
        /// Reduce quantity product in cart async
        /// </summary>
        /// <param name="addToCartDTO"></param>
        /// <returns></returns>
        public Task<string> ReduceQuantityAsync(AddToCartDTO addToCartDTO);

        /// <summary>
        /// Get cart by token cart async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<CartVM>> GetCartByTokenCartAsync();
    }
}
