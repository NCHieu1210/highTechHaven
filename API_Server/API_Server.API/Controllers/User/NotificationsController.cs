using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : BaseController
    {
        private readonly INotificationsService _notificationsService;

        public NotificationsController(INotificationsService notificationsService) {
            _notificationsService = notificationsService;
        }

        /// <summary>
        /// Get all notifications by token
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-by-token")]
        [Authorize]
        public async Task<IActionResult> GetByToken() {
            return await HandleGetRequestAsync(() => _notificationsService.GetNotificationsByTokenAsync(), result => result != null);
        }

        /// <summary>
        /// Get all notifications by token
        /// </summary>
        /// <returns></returns>
        [HttpPut("seen/{id}")]
        [Authorize]
        public async Task<IActionResult> SeenNotification(int id)
        {
            return await HandleUpdateRequestAsync(() => _notificationsService.SeenNotificationByIdAsync(id), result => result == true);
        }

        /// <summary>
        /// Get all notifications by token
        /// </summary>
        /// <returns></returns>
        [HttpPut("seen-all")]
        [Authorize]
        public async Task<IActionResult> SeenAllNotificationsByToken(int id)
        {
            return await HandleUpdateRequestAsync(() => _notificationsService.SeenAllNotificationsByTokenAsync(), result => result == true);
        }

    }
}
