using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.DTOs
{
    public class BlogDTO
    {
        public string Name { get; set; }
        public bool Status { get; set; }
        public BlogDTO()
        {
            Status = true;
        }
    }
}
