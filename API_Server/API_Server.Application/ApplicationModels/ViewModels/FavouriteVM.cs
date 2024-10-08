using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class FavouriteVM
    {
        public int Id { get; set; }
        public DateTime DateAdded { get; set; }
        public string UserID { get; set; }
        public string ProductOptionID { get; set; }
    }

    /*public class ProductOptionInFavoriteVM
    {
        public int Id { get; set; }
        public string Slug { get; set; } 
        public string Thumbnail { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string Discount { get; set; }
    }*/
}
