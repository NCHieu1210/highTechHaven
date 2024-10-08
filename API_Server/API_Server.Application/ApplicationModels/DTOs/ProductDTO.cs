using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class ProductDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Content { get; set; }
        public int? CategoryID { get; set; }
        public int? SupplierID { get; set; }
        public bool Status { get; set; }
        public ProductDTO()
        {
            Status = true;
        }

    }

    public class ProductImageDTO
    {
        public ICollection<string>? ImageUrl { get; set; }
        public ICollection<IFormFile>? ImageFile { get; set; }
        public bool IsThumbnail { get; set; }

        public ProductImageDTO()
        {
            IsThumbnail = false;
        }
    }

    public class ProductVariantDTO {
        public string? ThumbUrl { get; set; }
        public IFormFile? ThumbFile { get; set; }
        public string SKU { get; set; }
        public double Price { get; set; }
        public double? Discount { get; set; }
        public string Stock { get; set; }
        public int SellNumbers { get; set; }
        public bool IsDefault { get; set; }
        public bool Status { get; set; }
        public string Option { get; set; }
        public string Color { get; set; }

        public ProductVariantDTO()
        {
            Status = true;
            SellNumbers = 0;
            Discount = 0;
        }
    }

}
