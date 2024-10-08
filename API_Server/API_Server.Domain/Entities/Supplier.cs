using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Supplier
    {
        public int Id { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? Logo { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Email { get; set; }
        [RegularExpression(@"0\d{9}")]
        public string Phone { get; set; }
        public bool Status { get; set; }

        // Collection navigation property From Product
        public ICollection<Product> Products { get; set; }
    }
}
