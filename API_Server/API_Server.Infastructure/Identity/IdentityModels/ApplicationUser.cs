using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Identity.IdentityModels
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Slug { get; set; }
        public string Avatar { get; set; }
        public bool Sex { get; set; }
        public int NumberProducts { get; set; }
        public int NumberPosts { get; set; }
        public DateTime Birthday { get; set; }
        public DateTime CreateDate { get; set; }

        // Collection navigation property From Product
        public ICollection<ProductStatus> ProductStatus { get; set; }

        // Collection navigation property From Cart
        public ICollection<Cart> Carts { get; set; }

        // Collection navigation property From Favorite
        public ICollection<Favourite> Favorites { get; set; }

        // Collection navigation property From DeliveryAddress
        public ICollection<DeliveryAddress> DeliveryAddresses { get; set; }

        // Collection navigation property From Order
        public ICollection<Order> Orders { get; set; }

        // Collection navigation property From Comment
        public ICollection<Comment> Comments { get; set; }

        // Collection navigation property From Review
        public ICollection<Review> Reviews { get; set; }

        // Collection navigation property From LikedPost
        public ICollection<LikedPost> LikedPosts { get; set; }

        // Collection navigation property From LikedComment
        public ICollection<LikedComment> LikedComments { get; set; }

        // Collection navigation property From Post
        public ICollection<PostStatus> PostStatus { get; set; }

        // Collection navigation property From Notification
        public ICollection<UserNotification> UserNotifications { get; set; }

        // Collection navigation property From UserAction
        public ICollection<UserAction> UserActions { get; set; }

        public ApplicationUser()
        {
            CreateDate = DateTime.Now;
            NumberProducts = 0;
            NumberPosts = 0;
        }
    }
}
