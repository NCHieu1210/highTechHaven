using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class NotificationDTO
    {
        public string Icon { get; set; }
        public string Content {  get; set; }
        public string URL { get; set; }
        public string UserRequestID { get; set; }
        public string? UserResponseID { get; set; }
        public DateTime CreatedDate { get; set; }

        public NotificationDTO()
        {
            CreatedDate = DateTime.UtcNow;
        }
    }

    public class UserNotificationDTO {
        public bool IsSeen { get; set; }
        public string NotificationID { get; set; }
        public string UserID { get; set; }
        public UserNotificationDTO()
        {
            IsSeen = false;
        }
    }

}
