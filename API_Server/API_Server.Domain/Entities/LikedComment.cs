using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class LikedComment
    {
        public int Id { get; set; }
        public DateTime LikedDate { get; set; }
        public bool IsSeen { get; set; }
        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        // Reference navigation property to Comment
        public int CommentID { get; set; }
        public Comment Comment { get; set; }
    }
}
