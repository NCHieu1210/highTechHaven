using API_Server.Application.IServices;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class UserActionsController : ControllerBase
    {
        private readonly IUserActionsService _userActionService;

        public UserActionsController(IUserActionsService userActionService)
        {
            _userActionService = userActionService;
        }

        /// <summary>
        /// Get all user actions async
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var result = await _userActionService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
