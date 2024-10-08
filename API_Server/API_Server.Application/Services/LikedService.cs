using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class LikedService : ILikedService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Comment> _commentRP;
        private readonly IGenericRepository<Post> _postRP;
        private readonly IGenericRepository<LikedComment> _likedCommentRP;
        private readonly IGenericRepository<LikedPost> _likedPostRP;
        private readonly IIncludeWithUser<LikedComment> _includeWithUser;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LikedService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor) {
            _unitOfWork = unitOfWork;
            _commentRP = _unitOfWork.RepositoryComments;
            _postRP = _unitOfWork.RepositoryPosts;
            _likedCommentRP = _unitOfWork.RepositoryLikedComment;
            _likedPostRP = _unitOfWork.RepositoryLikedPost;
            _includeWithUser = _unitOfWork.IncludeLikedCommentWithUser;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Like or Unlike a comment async
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        public async Task HandleLikeCommentAsync(int commentId)
        {
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var existingComment = await _commentRP.GetAsync(commentId) ?? throw new Exception("No comment matching!"); 
            var existingLiked = await _likedCommentRP.GetAsync(l => (l.UserID == userID && l.CommentID == commentId));

            if (existingLiked == null) {
                var newLiked = new LikedCommentDTO
                {
                    CommentID = commentId,
                    UserID = userID,
                };
                await _likedCommentRP.CreateAsync(_mapper.Map<LikedComment>(newLiked));
            }
            else
            {
                await _likedCommentRP.DeleteAsync(existingLiked.Id);
            }
            await _unitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Like or Unlike a post async
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        public async Task HandleLikePostAsync(int postId)
        {
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var existingPost = await _postRP.GetAsync(postId) ?? throw new Exception("No post matching!");
            var existingLiked = await _likedPostRP.GetAsync(l => (l.UserID == userID && l.PostID == postId));

            if (existingLiked == null)
            {
                var newLiked = new LikedPostDTO
                {
                    PostID = postId,
                    UserID = userID,
                };
                await _likedPostRP.CreateAsync(_mapper.Map<LikedPost>(newLiked));
            }
            else
            {
                await _likedPostRP.DeleteAsync(existingLiked.Id);
            }
            await _unitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Get all liked async
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ICollection<LikedCommentVM>> GetAllLikedAsync()
        {
            var listLiked = await _likedCommentRP.GetAsync();
            var includeListLiked = new List<LikedComment>();
            foreach( var liked in listLiked)
            {
                var includeLiked = await _includeWithUser.GetGenericWithUserAsync(liked.Id) ?? throw new Exception("No data maching!");
                includeLiked = await _likedCommentRP.IncludeEntity(liked.Id, l => l.Comment) ?? throw new Exception("No data maching!");
                includeListLiked.Add(liked);
            }

            return _mapper.Map<ICollection<LikedCommentVM>>(includeListLiked);
        }

        /// <summary>
        /// Get liked by token async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<LikedCommentVM>> GetLikedCommentsByTokenAsync()
        {
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var  likedComments = await _likedCommentRP.GetICollectionAsync(l => l.UserID == userID);
            return _mapper.Map<ICollection<LikedCommentVM>>(likedComments);
        }

        /// <summary>
        /// Get liked by postId  async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<LikedPostVM>> GetLikedPostsByTokenAsync()
        {
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var likedPosts = await _likedPostRP.GetICollectionAsync(l => l.UserID == userID);
            return _mapper.Map<ICollection<LikedPostVM>>(likedPosts);
        }

        /// <summary>
        /// Get liked by commentId  async
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        public async Task<int> GetQuantityLikedByCommentAsync(int commentId)
        {
            var listLiked = await _likedCommentRP.GetICollectionAsync(l => l.CommentID == commentId);
            return listLiked.Count;
        }

        /// <summary>
        /// Get liked by postId  async
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        public async Task<int> GetQuantityLikedByPostAsync(int postId)
        {
            var listLiked = await _likedPostRP.GetICollectionAsync(l => l.PostID == postId);
            return listLiked.Count;
        }

    }
}
