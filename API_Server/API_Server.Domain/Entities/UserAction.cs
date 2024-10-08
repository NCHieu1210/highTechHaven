using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class UserAction
    {
        public int Id { get; set; }
        public string ActionType { get; set; }
        public string Area { get; set; }
        public string Entity { get; set; }  
        public string EntityId{ get; set; }
        public string EntityName { get; set; }
        public DateTime Timestamp { get; set; }
        public string Url { get; set; }
        public bool IsSeen { get; set; }
        //Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        public UserAction()
        {
            Timestamp = DateTime.UtcNow;
            IsSeen = false;
        }
    }
}
