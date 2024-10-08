using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace API_Server.Domain.Entities
{
    public class User
    {
        public string Id { get; set; }  
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Slug { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Avatar { get; set; }
        public bool Sex { get; set; }
        public int NumberProducts {  get; set; }
        public int NumberPosts {  get; set; }
        public DateTime Birthday { get; set; }
        public DateTime CreateDate { get; set; }
        public ICollection<string> Roles { get; set; }

        public User()
        {
            CreateDate = DateTime.UtcNow;
        }

    }
}
