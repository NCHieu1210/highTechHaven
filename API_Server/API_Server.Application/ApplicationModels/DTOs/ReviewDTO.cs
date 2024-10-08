using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class ReviewDTO
    {
        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public int Rating { get; set; }
        public string Content { get; set; }
        public DateTime ReviewDate { get; set; }
        public bool IsConfirmed { get; set; }
        public int ProductOptionID { get; set; }

        public ReviewDTO() {
            IsConfirmed = false;
            ReviewDate = DateTime.UtcNow;
        }
    }
}
