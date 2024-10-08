using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface INotificationsService
    {
        /// <summary>
        /// Create Notification async
        /// </summary>
        /// <param name="notificationDTO"></param>
        /// <param name="userRoles"></param>
        /// <returns></returns>
        public Task CreateNotificationAsync(NotificationDTO notificationDTO, List<string> userRoles);

        /// <summary>
        /// Get all notifications by token async
        /// </summary>
        /// <returns></returns>
        public Task<ListNotificationsVM> GetNotificationsByTokenAsync();

        /// <summary>
        /// Get all notifications by user id async
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<ListNotificationsVM> GetNotificationsByUserIdsync(string userId);

        /// <summary>
        ///  Seen notifications by user notification id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<bool> SeenNotificationByIdAsync(int id);

        /// <summary>
        /// Seen all notifications by token async
        /// </summary>
        /// <returns></returns>
        public Task<bool> SeenAllNotificationsByTokenAsync();

    }
}
