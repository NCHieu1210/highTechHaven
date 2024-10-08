using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class LikedCommentDTO
    {
        public DateTime LikedDate { get; set; }
        public bool IsSeen { get; set; }
        public string UserID { get; set; }
        public int CommentID { get; set; }

        public LikedCommentDTO()
        {
            LikedDate = DateTime.UtcNow;
        }
    }

    public class LikedPostDTO
    {
        public DateTime LikedDate { get; set; }
        public bool IsSeen { get; set; }
        public string UserID { get; set; }
        public int PostID { get; set; }

        public LikedPostDTO()
        {
            LikedDate = DateTime.UtcNow;
        }
    }
}
