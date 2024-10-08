using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class LikedPost
    {
        public int Id { get; set; }
        public DateTime LikedDate { get; set; }
        public bool IsSeen { get; set; }
        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        // Reference navigation property to Post
        public int PostID { get; set; }
        public Post Post { get; set; }
    }
}
