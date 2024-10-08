using API_Server.Domain.Entities;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class CategoryVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? Thumbnail { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public bool Status { get; set; }
        public int QuantityProducts { get; set; }
        public string ParentCategory { get; set; }
        public ICollection<CategoryVM> SubCategories { get; set; }
    }
}
