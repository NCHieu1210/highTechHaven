using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class CategoryDTO
    {
        [Required]
        public string Name { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public IFormFile? ThumbFile { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? ThumbUrl { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.

        public bool Status { get; set; }
        public int? ParentCategoryID { get; set; }

        public CategoryDTO() { 
            Status = true;
        }
    }
}
