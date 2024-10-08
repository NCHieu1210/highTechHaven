using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public enum PaymentMethods
    {
        cash = 0, VnPay = 1
    }
    public class Order
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime OrderDate { get; set; }
        public string Receiver { get; set; }
        /*[Required]
        [RegularExpression(@"0\d{9}")]*/
        public string DeliveryPhone { get; set; }
        public string DeliveryAddress { get; set; }
        public bool BuyAtTheStore { get; set; }
        [Column(TypeName = "varchar(20)")]
        public PaymentMethods PaymentMethods { get; set; }
        public bool Status { get; set; }

        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        // Collection navigation property From Child OrderDetail
        public ICollection<OrderDetail> OrderDetails { get; set; }

        // Collection navigation property From Child OrderUpdate
        public ICollection<OrderUpdate> OrderUpdates { get; set; }
    }
}
