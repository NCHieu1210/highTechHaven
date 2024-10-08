using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class DeliveryAddressDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [RegularExpression(@"0\d{9}")]
        public string Phone { get; set; }
        [Required]
        public string Address { get; set; }
    }
}
