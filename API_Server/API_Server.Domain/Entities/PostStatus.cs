using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class PostStatus
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar(20)")]
        public Name Name { get; set; } //Name is the enum parameter and this name is in the product module
        public DateTime Date { get; set; }

        // Reference navigation property to Product
        public int PostID { get; set; }
        public Post Post { get; set; }

        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        public PostStatus()
        {
            Date = DateTime.UtcNow;
        }
    }
}
