using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class UserActionsVM
    {
        public int Id { get; set; }
        public string Area { get; set; }
        public string ActionType { get; set; }
        public string Entity { get; set; }
        public string EntityId { get; set; }
        public string EntityName { get; set; }
        public DateTime Timestamp { get; set; }
        public string Url { get; set; }
        public bool IsSeen { get; set; }
        //Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public string UserName { get; set; }

    }
}
