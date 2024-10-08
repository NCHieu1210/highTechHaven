using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? Thumbnail { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool Status { get; set; }
        // Reference navigation property to Parent Category
        public int? ParentCategoryID { get; set; }
        public Category ParentCategory { get; set; }

        // Collection navigation property From Child Category
        public ICollection<Category> SubCategories { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}
