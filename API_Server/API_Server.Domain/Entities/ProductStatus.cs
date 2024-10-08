using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public enum Name 
    {
        Created = 0, Updated = 1, Deleted = 2 
    };

    public class ProductStatus
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar(20)")]
        public Name Name { get; set; }
        public DateTime Date { get; set; }

        // Reference navigation property to Product
        public int ProductID { get; set; }
        public Product Product { get; set; }

        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        public ProductStatus()
        {
            Date = DateTime.UtcNow;
        }
    }
}
