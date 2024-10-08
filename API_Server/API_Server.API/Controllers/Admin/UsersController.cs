using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using API_Server.Domain;
using API_Server.Domain.Models;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.Admin
{
    #region Administrator Modules
    [Route("api/admin/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly IUsersService _usersService;
        private readonly IAuthService _authService;

        public UsersController(IUsersService usersService, IAuthService authService)
        {
            _usersService = usersService;
            _authService = authService;
        }

        /// <summary>
        /// Get all users async
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> GetAllAync()
        {
            return await HandleGetRequestAsync(() => _usersService.GetAllAsync(), result => result != null);
        }

        /// <summary>
        /// Get all users async
        /// </summary>
        /// <returns></returns>
        [HttpGet("roles")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> GetAllRolesAsync()
        {
            return await HandleGetRequestAsync(() => _authService.GetAllRolesAsync(), result => result != null);
        }

        /// <summary>
        /// Register an user by admin async
        /// </summary>
        /// <param name="registerByAdminDTO"></param>
        /// <returns></returns>
        [HttpPost("register")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> RegisterUserByAdminAsync([FromForm] RegisterByAdminDTO registerByAdminDTO)
        {
            try
            {
                var result = await _authService.RegisterUserByAdminAsync(registerByAdminDTO, registerByAdminDTO.Password, registerByAdminDTO.Roles);
                if (!result.Success)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Register failed!",
                        Data = result
                    });
                }
                else
                {
                    return Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Register access!",
                        Data = result
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        /// <summary>
        /// Update an user by id with admin 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userDTO"></param>
        /// <returns></returns>
        [HttpPut("update/{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> UpdateUserByIdWithAdminAsync(string id, [FromForm] UserInAdminDTO userDTO)
        {
            return await HandleUpdateRequestAsync(() => _usersService.UpdateUserByIdWithAdminAsync(id, userDTO) , results => results != null);
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteUserByIdWithAdminAsync(string id)
        {
            return await HandleDeleteRequestAsync(() => _usersService.DeleteUserByIdWithAdminAsync(id), results => results != null);
        }
    }
    #endregion
}
