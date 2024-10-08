using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class DeliveryAddress
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [RegularExpression(@"0\d{9}")]
        public string Phone { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        /*public bool Selected { get; set; }*/

        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }
    }
}
