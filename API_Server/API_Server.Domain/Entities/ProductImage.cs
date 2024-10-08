using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class ProductImage
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public bool IsThumbnail { get; set; }

        // Reference navigation property to Product
        public int ProductID { get; set; }
        public Product Product { get; set; }

        // Collection navigation property From ProductVariants
        public ICollection<ProductVariant> ProductVariants { get; set; }
    }
}
