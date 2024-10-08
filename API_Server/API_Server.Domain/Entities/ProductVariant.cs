using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class ProductVariant
    {
        public int Id { get; set; }
        public string SKU { get; set; }
        public double Price { get; set; }
        public double? Discount { get; set; }
        public int Stock { get; set; }
        public int SellNumbers { get; set; }
        public bool IsDefault { get; set; }
        public bool Status { get; set; }

        // Reference navigation property to ProductImage
        public int? ProductImageID { get; set; }
        public ProductImage ProductImage { get; set; }

        // Reference navigation property to ProductOption
        public int ProductOptionID { get; set; }
        public ProductOption ProductOption { get; set; }

        // Reference navigation property to ProductColor
        public int ProductColorID { get; set; }
        public ProductColor ProductColor { get; set; }

        // Collection navigation property From Cart
        public ICollection<Cart> Carts { get; set; }

        // Collection navigation property From OrderDetail
        public ICollection<OrderDetail> OrderDetails { get; set; }

    }
}
