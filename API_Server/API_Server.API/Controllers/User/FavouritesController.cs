using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavouritesController : BaseController
    {
        private readonly IFavouritesService _favoritesService;

        public FavouritesController (IFavouritesService favoritesService)
        {
            _favoritesService = favoritesService;
        }

        /// <summary>
        /// Get favorite by token
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("get-by-token")]
        [Authorize]
        public async Task<IActionResult> GetFavoritesByToken()
        {
            return await HandleGetRequestAsync(() => _favoritesService.GetFavouritesByTokenAsync(), result => result != null);
        }

        /// <summary>
        /// Get favorite by token
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("check-favorite-by-token/{productOptionId}")]
        [Authorize]
        public async Task<IActionResult> CheckFavoritesByToken(int productOptionId)
        {
            try
            {
                bool result = await _favoritesService.CheckFavouritesByTokenAsync(productOptionId);
                return Ok(new ApiResponse
                {
                    Success = result ? true : false,
                    Message = result ? "The product is in the favorites list!" : "The product is't in the favorites list!",
                    Data = ""
                });
            }
            catch (Exception ex) { 
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = ""
                });
            }
        }

        /// <summary>
        ///  Add a product to favorite
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddToFavorites(int productOptionId)
        {
            return await HandleCreateRequestAsync(() => _favoritesService.AddToFavouritesAsync(productOptionId), result => result != null);
        }

        /// <summary>
        /// Remove a product form  favorite async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> RemoveFromFavorites(int productOptionId)
        {
            return await HandleDeleteRequestAsync(() => _favoritesService.RemoveFromFavouritesAsync(productOptionId), result => result != null);
        }
    }
}
