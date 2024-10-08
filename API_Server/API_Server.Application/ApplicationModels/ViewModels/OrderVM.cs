using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class OrderVM
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime OrderDate { get; set; }
        public string Receiver { get; set; }
        public string DeliveryPhone { get; set; }
        public string DeliveryAddress { get; set; }
        public bool BuyAtTheStore { get; set; }
        [Column(TypeName = "varchar(20)")]
        public PaymentMethods PaymentMethods { get; set; }
        public bool Status { get; set; }
        public User User { get; set; }
        public ICollection<OrderDetailVM> OrderDetails { get; set; }
        public ICollection<OrderUpdateVM> OrderUpdates { get; set; }

    }

    public class RevenueVM { 
        public DateTime SaleDate { get; set; }
        public double TotalAmount { get; set; }
    }
}
