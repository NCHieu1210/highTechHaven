using System.ComponentModel.DataAnnotations;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string Sex { get; set; }
        public DateTime BirthDay { get; set; }

        [Required]
        [RegularExpression(@"0\d{9}")]
        public string PhoneNumber { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string ConformPassword { get; set; }
    }

    public class RegisterByAdminDTO : RegisterDTO
    {
        public string Roles { get; set; }
    }
}
