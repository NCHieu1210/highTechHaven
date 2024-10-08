using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface ICategoriesService
    {
        /// <summary>
        /// Get all Categories async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<CategoryVM>> GetAllAsync();

        /// <summary>
        /// Get all Categories by admin async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<CategoryVM>> GetAllByAdminAsync();

        /// <summary>
        /// Get a category by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<CategoryVM> GetByIdAsync(int id);

        /// <summary>
        /// Get a category by slug async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<CategoryVM> GetBySlugAsync(string slug);

        /// <summary>
        /// Create a Category async
        /// </summary>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public Task<CategoryVM> CreateAsync(CategoryDTO categoryDTO);

        /// <summary>
        /// Update a Category async
        /// </summary>
        /// <param name="id"></param>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public Task<CategoryVM> UpdateAsync(int id, CategoryDTO categoryDTO);

        /// <summary>
        /// Delete a Category async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<CategoryVM> DeleteAsync(int id);

        /// <summary>
        /// Delete a range of category by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public Task<ICollection<CategoryVM>> DeleteRangeAsync(List<int> idsToDelete);
    }
}
