using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public string Icon { get; set; }
        public string Content { get; set; }
        public string URL { get; set; }
        public DateTime CreatedDate { get; set; }

        // Collection navigation property From Child UserNotification
        public ICollection<UserNotification> UserNotifications { get; set; }

    }
}
