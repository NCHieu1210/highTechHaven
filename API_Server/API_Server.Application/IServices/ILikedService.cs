using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface ILikedService
    {
        
        /// <summary>
        /// Like or Unlike a comment async
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        public Task HandleLikeCommentAsync(int commentId);

        /// <summary>
        /// Like or Unlike a post async
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        public Task HandleLikePostAsync(int postId);

        /// <summary>
        /// Get all liked async
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        public Task<ICollection<LikedCommentVM>> GetAllLikedAsync();

        /// <summary>
        /// Get liked by token async
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        public Task<ICollection<LikedCommentVM>> GetLikedCommentsByTokenAsync();

        /// <summary>
        /// et liked by token async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<LikedPostVM>> GetLikedPostsByTokenAsync();

        /// <summary>
        /// Get quantity liked by commentId async
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        public Task<int> GetQuantityLikedByCommentAsync(int commentId);

        /// <summary>
        /// Get quantity liked by postId async
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        public Task<int> GetQuantityLikedByPostAsync(int postId);

    }
}
