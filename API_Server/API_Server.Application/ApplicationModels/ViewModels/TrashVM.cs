using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class TrashVM
    {
        public int? IdProduct { get; set; }
        public int? IdPost { get; set; }
        public string Thumbnail { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public DateTime DeletedDate { get; set; }
        public string UserDeletedID { get; set; }
        public string UserFullName { get; set; }
        public int? DaysUntilPermanentDeletion { get; set; }

    }
}
