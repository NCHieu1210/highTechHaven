using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class CartVM
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public string UserID { get; set; }
        public string User { get; set; }
        public ProductVariantInCartVM ProductVariant { get; set; }
    }

    public class ProductVariantInCartVM
    {
        public int Id { get; set; }
        public string Slug { get; set; }
        public string Thumbnail { get; set; }
        public string Name { get; set; }
        public string Option { get; set; }
        public string Color { get; set; }
        public string Price { get; set; }
        public string Discount { get; set; }
        public string Stock { get; set; }
    }
}
