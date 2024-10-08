using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class ProductOptionType
    {
        public int Id { get; set; }
        public string SKU { get; set; }
        public string Option { get; set; }
        // Collection navigation property From ProductOption
        public ICollection<ProductOption> ProductOptions { get; set; }

    }
}
