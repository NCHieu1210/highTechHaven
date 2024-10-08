using API_Server.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class SupplierVM
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Logo { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [RegularExpression(@"0\d{9}")]
        public string Phone { get; set; }
        public int QuantityProducts { get; set; }
        public int Status { get; set; }

    }
}
