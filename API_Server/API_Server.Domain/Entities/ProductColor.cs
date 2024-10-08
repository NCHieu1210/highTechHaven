using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class ProductColor
    {
        public int Id { get; set; }
        public string SKU { get; set; }
        public string Color { get; set; }

        // Collection navigation property From ProductVariant
        public ICollection<ProductVariant> ProductVariants { get; set; }
    }
}
