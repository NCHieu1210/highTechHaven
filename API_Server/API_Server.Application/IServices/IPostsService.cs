using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IPostsService
    {
        /// <summary>
        /// Get all posts async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<PostVM>> GetAllAsync();

        /// <summary>
        /// Get a post by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<PostVM> GetByIdAsync(int id);

        /// <summary>
        /// Get a post by slug async
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public Task<PostVM> GetBySlugAsync(string slug);

        /// <summary>
        /// Get all post by logs async
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        public Task<ICollection<PostVM>> GetByBlogsAsync(int blogsId);

        /// <summary>
        /// Get post by search
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public Task<ICollection<PostVM>> GetBySearchAsync(string search);

        /// <summary>
        /// Create a post async
        /// </summary>
        /// <param name="productDTO"></param>
        /// <returns></returns>
        public Task<PostVM> CreateAsync(PostDTO postDTO);

        /// <summary>
        /// Update a post async
        /// </summary>
        /// <param name="id"></param>
        /// <param name="productDTO"></param>
        /// <returns></returns>
        public Task<PostVM> UpdateAsync(int id, PostDTO postDTO);

        /// <summary>
        /// Delete a post async 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<PostVM> DeleteAsync(int id);

        /// <summary>
        /// Delete a range of post by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public Task<ICollection<PostVM>> DeleteRangeAsync(List<int> idsToDelete);

        /// <summary>
        /// Permanently a deleted async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<PostVM> PermanentlyDeleted(int id);

        /// <summary>
        /// Restore a post async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        public Task<PostVM> RestorePostAsync(int id);

        /// <summary>
        /// Retore a range of post by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public Task<ICollection<PostVM>> RestoreRangePostsAsync(List<int> idsToRestore);
    }
}
