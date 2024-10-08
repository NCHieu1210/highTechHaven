using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public enum UpdateName
    {
        Cancelled = -1, Unconfirmed = 0, Processing = 1, Delivering = 2, Completed = 3 
    }
    public class OrderUpdate
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar(20)")]
        public UpdateName UpdateName { get; set; }
        public DateTime UpdateTime { get; set; }
        public bool Status { get; set; }

        // Reference navigation property to Order
        public int OrderID { get; set; }
        public Order Order { get; set; }
    }
}
