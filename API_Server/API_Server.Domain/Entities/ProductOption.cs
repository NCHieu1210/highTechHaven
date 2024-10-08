using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class ProductOption
    {
            public int Id { get; set; }
            // Reference navigation property to Product
            public int ProductID { get; set; }
            public Product Product { get; set; }

            // Reference navigation property to ProductOptionType
            public int ProductOptionTypeID { get; set; }
            public ProductOptionType ProductOptionType { get; set; }

            // Collection navigation property From ProductVariant
            public ICollection<ProductVariant> ProductVariants { get; set; }

            // Collection navigation property From Favorite
            public ICollection<Favourite> Favorites { get; set; }

            // Collection navigation property From Review
            public ICollection<Review> Reviews { get; set; }
    }
}
