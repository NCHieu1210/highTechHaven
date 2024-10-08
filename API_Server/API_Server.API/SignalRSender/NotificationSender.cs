using API_Server.API.SignalRHubs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.ISender;
using Microsoft.AspNetCore.SignalR;

namespace API_Server.API.SignalRSender
{
    public class NotificationSender : INotificationSender
    {
        private readonly IHubContext<NotificationsHub> _hubContext;

        public NotificationSender(IHubContext<NotificationsHub> hubContext)
        {
            _hubContext = hubContext;
        }

        /// <summary>
        /// Send new the notification async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="notification"></param>
        /// <returns></returns>
        public async Task SendNotificationAsync(string userId, NotificationVM notification)
        {
            await _hubContext.Clients.User(userId).SendAsync("NewNotifications", notification);
        }

        /// <summary>
        /// Send all notification by userId async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="notifications"></param>
        /// <returns></returns>
        public async Task SendAllNotioficationByUserId(string userId, ListNotificationsVM notifications)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotifications", notifications);
        }
    }
}
