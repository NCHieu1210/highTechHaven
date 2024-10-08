using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace API_Server.API.SignalRHubs
{
    [Authorize] // Yêu cầu người dùng phải xác thực
    public class NotificationsHub : Hub
    {
        private readonly INotificationsService _notificationsService;

        public NotificationsHub(INotificationsService notificationsService)
        {
            _notificationsService = notificationsService;
        }

        /// <summary>
        /// Lấy tất cả thông báo theo token
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> GetByToken()
        {
            try
            {
                var userId = Context.User?.FindFirst("UserID")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    throw new Exception("Invalid user!");
                }

                var result = await _notificationsService.GetNotificationsByUserIdsync(userId);
                if (result != null)
                {
                    await Clients.Caller.SendAsync("ReceiveNotifications", result); // Gửi thông báo đến client gọi
                    return new OkResult(); // Trả về trạng thái OK
                }
                return new NotFoundResult(); // Trả về trạng thái Not Found nếu không có thông báo
            }
            catch (Exception ex)
            {
                // Ghi log chi tiết về lỗi
                Console.WriteLine($"Error in GetByToken: {ex.Message}");
                throw; // Ném lại ngoại lệ để client có thể nhận biết được lỗi
            }
        }

    }
}
