using System.ComponentModel.DataAnnotations;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class LoginVM
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
