using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CartsController : BaseController
    {
        private readonly ICartService _cartService;

        public CartsController(ICartService cartService) {
            _cartService = cartService;
        }

        /// <summary>
        /// Add product to cart
        /// </summary>
        /// <param name="addToCartDTO"></param>
        /// <returns></returns>
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(AddToCartDTO addToCartDTO)
        {
            return await HandleCreateRequestAsync(() => _cartService.AddToCartAsync(addToCartDTO), result => result != null);
        }

        /// <summary>
        /// Reduce quantity product in cart async
        /// </summary>
        /// <param name="addToCartDTO"></param>
        /// <returns></returns>
        [HttpPost("reduce")]
        public async Task<IActionResult> ReduceQuantity(AddToCartDTO addToCartDTO)
        {
            return await HandleDeleteRequestAsync(() => _cartService.ReduceQuantityAsync(addToCartDTO), result => result != null);
        }

        /// <summary>
        /// Get cart by token cart async
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-by-token")]
        public async Task<IActionResult> GetCartByTokenCart()
        {
            return await HandleGetRequestAsync(() => _cartService.GetCartByTokenCartAsync(), result => result != null);
        }
    }
}
