using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ISender
{
    public interface INotificationSender
    {
        /// <summary>
        /// Send new the notification async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="notification"></param>
        /// <returns></returns>
        Task SendNotificationAsync(string userId, NotificationVM notification);

        /// <summary>
        /// Send all notification by userId async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="notifications"></param>
        /// <returns></returns>
        Task SendAllNotioficationByUserId(string userId, ListNotificationsVM notifications);
    }
}
