using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class ProductVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TotalStock { get; set; }
        public int TotalSellNumbers { get; set; }
        public int TotalVariants { get; set; }
        public double? TotalRating { get; set; }
        public string Slug { get; set; }
        public bool Status { get; set; }
        public string Category { get; set; }
        public string Supplier { get; set; }
    }
    public class ProductVariantDetailVM
    {
        public int Id { get; set; }
        public string Thumbnail { get; set; }
        public string SKU { get; set; }
        public string Name { get; set; }
        public int ColorID { get; set; }
        public string Color { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }
        public double Discount { get; set; }
        public int SellNumbers { get; set; }
        public bool IsDefault { get; set; }
        public bool Status { get; set; }
    }

    public class ProductVariantVM : ProductVariantDetailVM
    {
        public int OptionID { get; set; }
        public string Option { get; set; }
    }

    public class ProductStatusVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string UserID { get; set; }
        public string UserFullName { get; set; }
    }
    public class ProductColorVM
    {
        public string Color { get; set; }
    }

    public class ProductImageVM
    {
        public string Image { get; set; }

    }

    public class ProductOptionVM
    {
        public int Id { get; set; }
        public string Option { get; set; }
        public double? Rating { get; set; }
        public ICollection<ProductVariantDetailVM> ProductVariants { get; set; }

    }

    #region Model Product in Admin Page
    public class ProductsVM: ProductVM
    {
        public ICollection<ProductStatusVM> ProductStatus { get; set; }
        public ProductVariantVM ProductVariants { get; set; }
        public ProductsVM Clone()
        {
            return new ProductsVM
            {
                Id = this.Id,
                Name = this.Name,
                TotalStock = this.TotalStock,
                TotalSellNumbers = this.TotalSellNumbers,
                TotalVariants = this.TotalVariants,
                TotalRating = this.TotalRating,
                Slug = this.Slug,
                Status = this.Status,
                Category = this.Category,
                Supplier = this.Supplier,
                ProductStatus = this.ProductStatus,
                ProductVariants = this.ProductVariants,
            };
        }
    }

    #endregion


    #region Model Product in Client Page
    public class ProductDetailVM : ProductVM
    {
        public string Content { get; set; }
        public ICollection<ProductStatusVM> ProductStatus { get; set; }
        public ICollection<ProductOptionVM> ProductOptions { get; set; }
        public ICollection<ProductImageVM> ProductImages { get; set; }
    }

    public class ProductVariantBySlugVM : ProductVM
    {
        public string Content { get; set; }
        public ProductVariantVM ProductVariant { get; set; }
        public ICollection<OptionBySlugVM> ProductOptions { get; set; }
        public ICollection<ProductImageVM> ProductImages { get; set; }

    }

    public class OptionBySlugVM
    {
        public int Id { get; set; }
        public string Option { get; set; }
        public ICollection<VariantBySlugVM> Variants { get; set; }
    }

    public class VariantBySlugVM
    {
        public int Id { get; set; }
        public string Thumbnail { get; set; }
        public string Option { get; set; }
        public string Color { get; set; }
        public double Price { get; set; }
        public double Discount { get; set; }
    }
    #endregion
}
