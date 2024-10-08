using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public bool Status { get; set; }

        // Collection navigation property From ProductOption
        public ICollection<ProductImage> ProductImages { get; set; }

        // Collection navigation property From ProductOption
        public ICollection<ProductOption> ProductOptions { get; set; }

        // Collection navigation property From ProductStatus
        public ICollection<ProductStatus> ProductStatus { get; set; }

        // Reference navigation property to Categoy
        public int? CategoryID { get; set; }
        public Category Category { get; set; }

        // Reference navigation property to Supplier
        public int? SupplierID { get; set; }
        public Supplier Supplier { get; set; }

        // Collection navigation property From Comment
        public ICollection<Comment> Comments { get; set; }

        [NotMapped]
        public int? DaysUntilPermanentDeletion
        {
            get
            {
                var checkIsDeleted = ProductStatus.SingleOrDefault(p => p.Name == Entities.Name.Deleted);
                if (checkIsDeleted != null)
                {
                    var daysPassed = (DateTime.UtcNow - checkIsDeleted.Date).Days;
                    return 30 - daysPassed;
                }
                return null;
            }
        }
    }
}
