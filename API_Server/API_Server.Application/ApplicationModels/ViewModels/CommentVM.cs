using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class CommentVM
    {
        public int Id { get; set; }
        [Required]
        public string Content { get; set; }
        public int QuantityLiked { get; set; }
        public DateTime CreatedDate { get; set; }
        public TimeSpan LastCommentTime { get; set ; } 
        public bool Status { get; set; }
        public bool IsSeen { get; set; }
        public int? ParentCommentID { get; set; }
        public UserCommentVM User { get; set; }
        public int? ProductID { get; set; }
        public int? PostID { get; set; }
        public ICollection<CommentVM> SubComments { get; set; }
    }

    public class UserCommentVM {
        public string Id { get; set; }
        public string Avatar { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsCustomer { get; set; }

    }

}
