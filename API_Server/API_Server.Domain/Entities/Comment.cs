using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool Status { get; set; }
        public bool IsSeen { get; set; }

        // Reference navigation property to Parent Comment
        public int? ParentCommentID { get; set; }
        public Comment ParentComment { get; set; }

        // Reference navigation property to User
        public string UserID { get; set; }
        [NotMapped]
        public User User { get; set; }

        // Reference navigation property to Product
        public int? ProductID { get; set; }
        public Product Product { get; set; }

        // Reference navigation property to Post
        public int? PostID { get; set; }
        public Post Post { get; set; }

        // Collection navigation property From Child Comment
        public ICollection<Comment> SubComments { get; set; }

        // Collection navigation property From LikedComments
        public ICollection<LikedComment> LikedComments { get; set; }
    }
}
