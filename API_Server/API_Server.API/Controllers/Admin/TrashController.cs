using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_Server.API.Controllers.Admin
{
    [Route("api/Admin/[controller]")]
    [ApiController]
    public class TrashController : BaseController
    {
        private readonly ITrashService _trashService;

        public TrashController (ITrashService trashService)
        {
            _trashService = trashService;
        }

        /// <summary>
        /// Get all products and posts in trash
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> GetAllAsync()
        {
            return await HandleGetRequestAsync(() => _trashService.GetAllAsyc(), result => result != null);
        }

        /// <summary>
        /// Restore product and post by id in the trash async
        /// </summary>
        /// <returns></returns>
        [HttpPut("restore")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> Restore()
        {
            return await HandleGetRequestAsync(() => _trashService.GetAllAsyc(), result => result != null);
        }
    }
}
