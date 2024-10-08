using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class NotificationVM
    {
        public int Id { get; set; }
        public int NotifID { get; set; }
        public string Icon { get; set; }
        public string Content { get; set; }
        public string URL { get; set; }
        public bool IsSeen { get; set; }
        public TimeSpan LastTime { get; set; }
    }

    public class ListNotificationsVM {
        public bool IsSeenAll { get; set; }
        public ICollection<NotificationVM> Notification { get; set; }

        public ListNotificationsVM()
        {
            IsSeenAll = true;
        }
    } 
}
