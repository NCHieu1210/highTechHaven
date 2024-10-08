using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class SupplierDTO
    {
        [Required]
        public string Name { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public IFormFile? FileLogo { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? UrlLogo { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        [EmailAddress]
        public string Email { get; set; }
        [RegularExpression(@"0\d{9}")]
        public string Phone { get; set; }
        public bool Status { get; set; }

        public SupplierDTO() {
            Status = true;
        }
    }
}
