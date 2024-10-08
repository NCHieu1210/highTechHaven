using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface ICommentsService
    {
        /// <summary>
        /// Get all comments async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<CommentVM>> GetAllCommentsAync();

        /// <summary>
        /// Get collection comments by product id aync
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Task<ICollection<CommentVM>> GetCommentsByProductIdAync(int productId);

        /// <summary>
        /// Get collection comments by post id aync
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        public Task<ICollection<CommentVM>> GetCommentsByPostIdAync(int postId);


        /// <summary>
        /// Add comment async
        /// </summary>
        /// <param name="comment"></param>
        /// <returns></returns>
        public Task<CommentVM> AddCommentAync(CommentDTO commentDTO);

    }
}
