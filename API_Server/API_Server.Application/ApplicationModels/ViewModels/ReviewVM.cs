using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ApplicationModels.ViewModels
{
    public class ReviewVM
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Content { get; set; }
        public DateTime ReviewDate { get; set; }
        public TimeSpan LastReviewTime { get; set; }
        public bool IsConfirmed { get; set; }
        public bool IsSeen { get; set; }
        public string ProductSlug { get; set; }
        public string ProductName { get; set; }
        public ProductOptionVM ProductOption { get; set; }
        public string SlugUser { get; set; }
        public string UserAvatar { get; set; }
        public string UserFullName { get; set; }

    }

    public class ListStarVM {
        public int OneStar {  get; set; }
        public int TwoStar {  get; set; }
        public int ThreeStar {  get; set; }
        public int FourStar {  get; set; }
        public int FiveStar {  get; set; }
        public ListStarVM()
        {
            OneStar = TwoStar = ThreeStar = FourStar = FiveStar = 0;
        }
    }

    public class ListReviewVM { 
        public int ReviewsNumber {  get; set; }
        public double? TotalRating { get; set; }
        public ListStarVM ListStar {  get; set; }
        public ProductOptionVM ProductOption { get; set; }
        public ICollection<ReviewVM> Reviews { get; set; }
    }
}
