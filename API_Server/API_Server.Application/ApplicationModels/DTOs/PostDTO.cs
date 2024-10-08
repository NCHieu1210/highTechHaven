using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class PostDTO
    {
        [Required]
        public string Name { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public IFormFile? ThumbFile { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string ThumbUrl { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public string KeywordProduct { get; set; }
        public int Views { get; set; }
        public int? BlogID { get; set; }
        public bool Status { get; set; }

        public PostDTO()
        {
            Status = true;
            Views = 0;
        }
    }
}
