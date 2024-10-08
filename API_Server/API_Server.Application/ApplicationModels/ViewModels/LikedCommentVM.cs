using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class LikedCommentVM
    {
        public int Id { get; set; }
        public DateTime LikedDate { get; set; }
        public TimeSpan LastLikedTime { get; set; }
        public int CommentID { get; set; }
        public User User { get; set; }
    }
    public class LikedPostVM
    {
        public int Id { get; set; }
        public DateTime LikedDate { get; set; }
        public TimeSpan LastLikedTime { get; set; }
        public int PostID { get; set; }
        public User User { get; set; }
    }
}
