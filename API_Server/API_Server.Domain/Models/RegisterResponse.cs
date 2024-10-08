using API_Server.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Models
{
    public class RegisterResponse
    {
        public string Id { get; set; }
        public bool Success { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public ICollection<string> Errors { get; set; }

    }
}
