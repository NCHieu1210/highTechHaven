using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class OrderDTO
    {
        [Required]
        public string Receiver { get; set; }

        [Required]
        [RegularExpression(@"0\d{9}")]
        public string DeliveryPhone { get; set; }

        [Required]
        public string DeliveryAddress { get; set; }

        public bool BuyAtTheStore { get; set; }
        public PaymentMethods PaymentMethods { get; set; }
    }
    public class OrderDetailDTO
    {
        [Required]
        public int ProductVariantID { get; set; }

        [Required]
        public int Quantity { get; set; }

        public double Discount { get; set; }

        public double UnitPrice { get; set; }
    }
}
