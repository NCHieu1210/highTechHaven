using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Content { get; set; }
        public DateTime ReviewDate { get; set; }
        public bool IsSeen { get; set; }
        public bool IsConfirmed { get; set; }

        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        // Reference navigation property to Product
        public int ProductOptionID { get; set; }
        public ProductOption ProductOption { get; set; }
    }
}
