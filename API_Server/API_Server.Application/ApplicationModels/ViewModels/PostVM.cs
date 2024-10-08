using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class PostVM
    {
        public int Id { get; set; }
        public string Thumbnail { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public string KeywordProduct { get; set; }
        public int Views { get; set; }
        public int QuantityLiked { get; set; }
        public bool Status { get; set; }
        // Reference navigation property to Blog
        public int? BlogID { get; set; }
        public string Blog { get; set; }
        public ICollection<PostStatusVM> PostStatus { get; set; }

    }

    public class PostStatusVM
    {
        public int  Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string UserID { get; set; }
        public string Avatar { get; set; }
        public string UserFullName { get; set; }
    }
}
