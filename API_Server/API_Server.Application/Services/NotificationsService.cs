using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.ISender;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class NotificationsService : INotificationsService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Notification> _notificationPR;
        private readonly IGenericRepository<UserNotification> _userNotificationPR;
        private readonly IUsersRepository _usersRP;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly INotificationSender _notificationSender;

        public NotificationsService(IMapper mapper, IUnitOfWork unitOfWork, IUsersRepository usersRP,
            IHttpContextAccessor httpContextAccessor, INotificationSender notificationSender)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _notificationPR = _unitOfWork.RepositoryNotification;
            _userNotificationPR = _unitOfWork.RepositoryUserNotification;
            _usersRP = usersRP;
            _httpContextAccessor = httpContextAccessor;
            _notificationSender = notificationSender;
        }

        /// <summary>
        /// Create Notification async
        /// </summary>
        /// <param name="notificationDTO"></param>
        /// <param name="userRoles"></param>
        /// <returns></returns>
        public async Task CreateNotificationAsync(NotificationDTO notificationDTO, List<string> userRoles)
        {
            var notification = _mapper.Map<Notification>(notificationDTO);

            await _notificationPR.CreateAsync(notification);
            await _unitOfWork.SaveChangesAsync();

            var roleName = await _usersRP.GetRolesByUserID(notificationDTO.UserRequestID);

            if(roleName.Contains(UserRole.Customer) && notificationDTO.UserResponseID == null && roleName.Any())
            {
                var userNotifs = new List<UserNotification>();
                var validRoles = userRoles;
                var usersWithValidRoles = await _usersRP.GetUserByRoleName(validRoles);
                foreach(var user in usersWithValidRoles)
                {
                    var newUserNotif = new UserNotification()
                    {
                        UserID = user.Id,
                        NotificationID = notification.Id,
                    };
                    userNotifs.Add(newUserNotif);
                }
                await _userNotificationPR.CreateRangeAsync(userNotifs);
                await _unitOfWork.SaveChangesAsync();

                foreach(var userNotif in userNotifs)
                {
                    var notificationVM = _mapper.Map<NotificationVM>(userNotif);
                    var notificationsByUserId = await GetNotificationsByUserIdsync(userNotif.UserID);
                    await _notificationSender.SendNotificationAsync(userNotif.UserID, notificationVM);
                    await _notificationSender.SendAllNotioficationByUserId(userNotif.UserID, notificationsByUserId);
                }    
            }
            else
            {
                var newUserNotif = new UserNotification()
                {
                    UserID = notificationDTO.UserResponseID,
                    NotificationID = notification.Id,
                };

                await _userNotificationPR.CreateAsync(newUserNotif);
                await _unitOfWork.SaveChangesAsync();

                var notificationVM = _mapper.Map<NotificationVM>(newUserNotif);
                var notificationsByUserId = await GetNotificationsByUserIdsync(newUserNotif.UserID);
                await _notificationSender.SendNotificationAsync(newUserNotif.UserID, notificationVM);
                await _notificationSender.SendAllNotioficationByUserId(newUserNotif.UserID, notificationsByUserId);
            }
        }

        /// <summary>
        /// Get notifications by token async
        /// </summary>
        /// <returns></returns>
        public async Task<ListNotificationsVM> GetNotificationsByTokenAsync()
        {
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value ?? throw new Exception("Invalid user!");
            var userNotifi = await _userNotificationPR.GetICollectionAsync(uN => uN.UserID == userID);
            if (!userNotifi.Any())
            {
                throw new Exception("No data matching!");
            }
            userNotifi = await _userNotificationPR.IncludeEntities(userNotifi.Select(uN => (object)uN.Id), uN => uN.Notification);
            var listNotifi = new ListNotificationsVM()
            {
                IsSeenAll = true,
                Notification = _mapper.Map<ICollection<NotificationVM>>(userNotifi),
            };

            listNotifi.Notification = listNotifi.Notification.Reverse().ToList();

            if (listNotifi.Notification.Any(n => n.IsSeen == false))
            {
                listNotifi.IsSeenAll = false;
            }    

            return listNotifi;
        }



        /// <summary>
        /// Get all notifications by user id async
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<ListNotificationsVM> GetNotificationsByUserIdsync(string userId)
        {
            var userNotifi = await _userNotificationPR.GetICollectionAsync(uN => uN.UserID == userId);
            if (!userNotifi.Any())
            {
                return new ListNotificationsVM();
            }
            userNotifi = await _userNotificationPR.IncludeEntities(userNotifi.Select(uN => (object)uN.Id), uN => uN.Notification);
            var listNotifi = new ListNotificationsVM()
            {
                IsSeenAll = true,
                Notification = _mapper.Map<ICollection<NotificationVM>>(userNotifi),
            };

            listNotifi.Notification = listNotifi.Notification.Reverse().ToList();

            if (listNotifi.Notification.Any(n => n.IsSeen == false))
            {
                listNotifi.IsSeenAll = false;
            }

            return listNotifi;
        }

        /// <summary>
        ///  Seen notifications by user notification id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> SeenNotificationByIdAsync(int id)
        {
            try
            {
                var userNotif = await _userNotificationPR.GetAsync(id) ?? throw new Exception("no data matching!");
                var notification = (await _userNotificationPR.IncludeEntity(userNotif.Id, uN => uN.Notification)).Notification;
                userNotif.IsSeen = true;
                await _userNotificationPR.UpdateAsync(userNotif.Id, userNotif);
                await _unitOfWork.SaveChangesAsync();

                var notificationsByUserId = await GetNotificationsByUserIdsync(userNotif.UserID);
                await _notificationSender.SendAllNotioficationByUserId(userNotif.UserID, notificationsByUserId);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Seen all notifications by token async
        /// </summary>
        /// <returns></returns>
        public async Task<bool> SeenAllNotificationsByTokenAsync()
        {
            try
            {
                var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value ?? throw new Exception("Invalid user!");
                var userNotifications = await _userNotificationPR.GetICollectionAsync(uN => uN.IsSeen == false);
                if (userNotifications.Any())
                {
                    foreach (var notification in userNotifications)
                    {
                        notification.IsSeen = true;
                    }
                    await _userNotificationPR.UpdateRangeAsync(userNotifications);
                    await _unitOfWork.SaveChangesAsync();
                }
                var notificationsByUserId = await GetNotificationsByUserIdsync(userID);
                await _notificationSender.SendAllNotioficationByUserId(userID, notificationsByUserId);
                return true;

            }
            catch
            {
                return false;
            }
        }
    }
}
