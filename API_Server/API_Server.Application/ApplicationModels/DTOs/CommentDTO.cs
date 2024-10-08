using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class CommentDTO
    {
        [Required]
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsSeen { get; set; }
        public bool Status { get; set; }
        public int? ParentCommentID { get; set; }
        public int? ProductID { get; set; }
        public int? PostID { get; set; }

        public CommentDTO()
        {
            Status = true;
            CreatedDate = DateTime.UtcNow;
        }
    }
}
