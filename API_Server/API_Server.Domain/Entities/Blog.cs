using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool Status { get; set; }

        // Collection navigation property From Favorite
        public ICollection<Post> Posts { get; set; }
    }
}
