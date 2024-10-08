using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IBlogsService
    {
        /// <summary>
        /// Get All Blogs
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<BlogVM>> GetAllAsync();

        /// <summary>
        /// Get a Blog by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<BlogVM> GetByIdAsync(int id);

        /// <summary>
        /// Get a Blogs by slug
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<BlogVM> GetBySlugAsync(string slug);

        /// <summary>
        /// Create a Blog
        /// </summary>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public Task<BlogVM> CreateAsync(BlogDTO blogDTO);

        /// <summary>
        /// Update a Blog 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public Task<BlogVM> UpdateAsync(int id, BlogDTO blogDTO);

        /// <summary>
        /// Delete a Blogs
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<BlogVM> DeleteAsync(int id);

        /// <summary>
        /// Delete a range of Blog by expression lambda async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<ICollection<BlogVM>> DeleteRangeAsync(List<int> idsToDelete);
    }
}
