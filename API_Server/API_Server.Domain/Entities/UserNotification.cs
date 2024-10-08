using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class UserNotification
    {
        public int Id {  get; set; }
        public bool IsSeen {  get; set; }

        //Reference navigation property to Notification
        public int NotificationID { get; set; }
        public Notification Notification { get; set; }

        //Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }
        
    }
}
