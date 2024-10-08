using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService) {
            _usersService = usersService;
        }

        /// <summary>
        /// Get a user by token
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-by-token")]
        [Authorize]
        public async Task<IActionResult> GetByTokenAync()
        {
            return await HandleGetRequestAsync(() => _usersService.GetByTokenAsync(), resule => resule != null);
        }

        /// <summary>
        /// Update an user by id 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userDTO"></param>
        /// <returns></returns>
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUserAsync( [FromForm] UserDTO userDTO)
        {
            return await HandleUpdateRequestAsync(() => _usersService.UpdateUserAsync(userDTO), results => results != null);
        }

        /// <summary>
        /// Get all delivery addresses async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        [HttpGet("delivery-address")]
        [Authorize]
        public async Task<IActionResult> GetAllDeliveryAddressAsync()
        {
            return await HandleGetRequestAsync(() => _usersService.GetAllDeliveryAddressAsync(), results => results != null);
        }

        /// <summary>
        /// Get a delivery address async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        [HttpGet("delivery-address/{id}")]
        [Authorize]
        public async Task<IActionResult> GetDeliveryAddressByIdAsync(int id)
        {
            return await HandleGetRequestAsync(() => _usersService.GetDeliveryAddressByIdAsync(id), results => results != null);
        }

        /// <summary>
        /// Get a delivery address by token async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        [HttpGet("delivery-address/get-by-token")]
        [Authorize]
        public async Task<IActionResult> GetDeliveryAddressByTokenAsync()
        {
            return await HandleGetRequestAsync(() => _usersService.GetDeliveryAddressByTokenAsync(), results => results != null);
        }

        /// <summary>
        /// Create a delivery address async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        [HttpPost("delivery-address")]
        [Authorize]
        public async Task<IActionResult> CreateDeliveryAddressAsync([FromForm] DeliveryAddressDTO deliveryAddressDTO)
        {
            return await HandleCreateRequestAsync(() => _usersService.CreateDeliveryAddressAsync(deliveryAddressDTO), results => results != null);
        }

        /// <summary>
        /// Update a delivery address async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        [HttpPut("delivery-address/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateDeliveryAddressAsync(int id, [FromForm] DeliveryAddressDTO deliveryAddressDTO)
        {
            return await HandleUpdateRequestAsync(() => _usersService.UpdateDeliveryAddressAsync(id, deliveryAddressDTO), results => results != null);
        }


        /// <summary>
        /// Delete a delivery address async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("delivery-address/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteDeliveryAddressAsync(int id)
        {
            return await HandleDeleteRequestAsync(() => _usersService.DeleteDeliveryAddressAsync(id), results => results != null);
        }
    }
}
