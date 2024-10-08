using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class AddToCartDTO
    {
        public int ProductVariantID { get; set; }
        public int Quantity { get; set; }
    }
}
