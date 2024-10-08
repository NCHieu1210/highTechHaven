using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public double? Discount { get; set; }
        public double UnitPrice { get; set; }

        // Reference navigation property to Order
        public int ProductVariantID { get; set; }
        public ProductVariant ProductVariants { get; set; }

        // Reference navigation property to Order
        public int OrderID { get; set; }
        public Order Order { get; set; }
    }
}
