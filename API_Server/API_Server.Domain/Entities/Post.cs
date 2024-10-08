using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Post
    {
        public int Id { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? Thumbnail {get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public int Views { get; set; }
        public string KeywordProduct { get; set; }
        public bool Status { get; set; }
        // Reference navigation property to Blog
        public int? BlogID { get; set; }
        public Blog Blog { get; set; }

        // Collection navigation property From Comment
        public ICollection<Comment> Comments { get; set; }

        // Collection navigation property From LikedPost
        public ICollection<LikedPost> LikedPosts { get; set; }

        // Collection navigation property From PostStatus
        public ICollection<PostStatus> PostStatus { get; set; }

        [NotMapped]
        public int? DaysUntilPermanentDeletion
        {
            get
            {
                var checkIsDeleted = PostStatus.SingleOrDefault(p => p.Name == Entities.Name.Deleted);
                if (checkIsDeleted != null)
                {
                    var daysPassed = (DateTime.UtcNow - checkIsDeleted.Date).Days;
                    return 30 - daysPassed;
                }
                return null;
            }
        }
    }
}
