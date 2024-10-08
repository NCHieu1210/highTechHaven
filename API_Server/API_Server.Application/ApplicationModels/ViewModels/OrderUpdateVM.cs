using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class OrderUpdateVM
    {
        public int Id { get; set; }
        public string CodeOrder { get; set; }
        public string UpdateName { get; set; }
        public DateTime UpdateTime { get; set; }
        public bool Status { get; set; }
    }
}
