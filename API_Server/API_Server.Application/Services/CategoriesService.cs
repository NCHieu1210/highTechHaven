using API_Server.Application.IServices;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API_Server.Application.Helpers;
using API_Server.Application.ApplicationModels.ServiceModels;
using System.Linq.Expressions;

namespace API_Server.Application.Services
{
    public class CategoriesService : ICategoriesService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Category> _categoriesRP;
        private readonly IHelpersService _helpersService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Injection IUnitOfWork and IUploadFileService
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="uploadFile"></param>
        public CategoriesService(IUnitOfWork unitOfWork, IHelpersService helpersService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _categoriesRP = unitOfWork.RepositoryCategories;
            _helpersService = helpersService;
            _mapper = mapper;
        }

        /// <summary>
        /// Create a category
        /// </summary>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public async Task<CategoryVM> CreateAsync(CategoryDTO categoryDTO)
        {
            var category = _mapper.Map<Category>(categoryDTO);
            category.Slug = _helpersService.GenerateSlug(category.Name);

            //Upload Image
            string path =  _helpersService.GetImageName(categoryDTO.ThumbFile, "categories", category.Slug) ?? throw new Exception("The uploaded file is not a valid image.");
            category.Thumbnail = path;

            //Update database
            await _categoriesRP.CreateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            //Upload file image
            await _helpersService.UploadImageAsync(categoryDTO.ThumbFile, path);

            //Include and return data
            var incluCategory = await _categoriesRP.IncludeEntity(category.Id, (c => c.ParentCategory));
            return _mapper.Map<CategoryVM>(incluCategory);
        }

        /// <summary>
        /// Delete a category
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<CategoryVM> DeleteAsync(int id)
        {
            var existingCategory = await _categoriesRP.GetAsync(id);
            if (existingCategory == null)
            {
                return null;
            }
            else
            {
                var incluCategory = await _categoriesRP.IncludeEntity(existingCategory.Id, (c => c.ParentCategory));
                await _categoriesRP.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                //Delete file image
                if (!string.IsNullOrEmpty(existingCategory.Thumbnail))
                {   
                    await _helpersService.DeleteImageAsync(existingCategory.Thumbnail);
                }

                return _mapper.Map<CategoryVM>(incluCategory);
            }
        }

        /// <summary>
        /// Delete a range of category by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public async Task<ICollection<CategoryVM>> DeleteRangeAsync(List<int> idsToDelete)
        {
            Expression<Func<Category, bool>> filter = category => idsToDelete.Contains(category.Id);

            var categoriesToDelete = await _categoriesRP.GetICollectionAsync(filter);

            if (categoriesToDelete.Count != idsToDelete.Count)
            {
                return null;
            }

            await _categoriesRP.DeleteRangeAsync(filter);
            await _unitOfWork.SaveChangesAsync();

            foreach (var category in categoriesToDelete)
            {
                if (!string.IsNullOrEmpty(category.Thumbnail))
                {
                    await _helpersService.DeleteImageAsync(category.Thumbnail);
                }
            }

            return _mapper.Map<ICollection<CategoryVM>>(categoriesToDelete);
        }

        /// <summary>
        /// Get all categories async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<CategoryVM>> GetAllAsync()
        {
            var categories = await _categoriesRP.GetICollectionAsync(c =>  c.ParentCategoryID == null);
            categories = await _categoriesRP.IncludeEntities(categories.Select(c => (object)c.Id),
                                                             category => category.Products,
                                                             category => category.SubCategories);
            foreach (var category in categories) {
                if(category.SubCategories.Any())
                {
                    category.SubCategories = await _categoriesRP.IncludeEntities(category.SubCategories.Select(c => (object)c.Id),
                                                                                 category => category.Products,
                                                                                 category => category.SubCategories);
                }    
            }
            return _mapper.Map<ICollection<CategoryVM>>(categories);
        }

        /// <summary>
        /// Get all categories by admin async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<CategoryVM>> GetAllByAdminAsync()
        {
            var categories = await _categoriesRP.GetAsync();
            categories = await _categoriesRP.IncludeEntities(categories.Select(c => (object)c.Id),
                                                             category => category.Products,
                                                             category => category.ParentCategory,
                                                             category => category.SubCategories);
            foreach (var category in categories)
            {
                if (category.SubCategories.Any())
                {
                    category.SubCategories = await _categoriesRP.IncludeEntities(category.SubCategories.Select(c => (object)c.Id),
                                                                                 category => category.Products,
                                                                                 category => category.SubCategories);
                }
            }
            return _mapper.Map<ICollection<CategoryVM>>(categories);
        }

        /// <summary>
        /// Get a category by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<CategoryVM> GetByIdAsync(int id)
        {
            var category = await _categoriesRP.GetAsync(id);
            if (category == null)
            {
                return _mapper.Map<CategoryVM>(category);
            }    
            var incluCategory = await _categoriesRP.IncludeEntity(category.Id, (c => c.ParentCategory));
            return _mapper.Map<CategoryVM>(incluCategory);
        }

        /// <summary>
        /// Get a category by slug
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public async Task<CategoryVM> GetBySlugAsync(string slug)
        {
            var category = await _categoriesRP.GetAsync(c => c.Slug == slug );
            if (category == null)
            {
                return _mapper.Map<CategoryVM>(category);
            }
            var incluCategory = await _categoriesRP.IncludeEntity(category.Id, (c => c.ParentCategory));
            return _mapper.Map<CategoryVM>(incluCategory);
        }

        /// <summary>
        /// Update a category by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<CategoryVM> UpdateAsync(int id, CategoryDTO categoryDTO)
        {
            if (!string.IsNullOrEmpty(categoryDTO.ThumbUrl) && categoryDTO.ThumbFile != null)
            {
                throw new Exception("Input data is incorrect!");
            }
            var existingCategory = await _categoriesRP.GetAsync(id);
            if (existingCategory == null || existingCategory.Id != id)
            {
                throw new Exception("No data maching!");
            }
            string pathImageOld = existingCategory.Thumbnail;

            var category = _mapper.Map<Category>(categoryDTO);
            category.Slug = _helpersService.GenerateSlug(category.Name);
            category.Id = id;

            //Check if url logo is null or empty
            if (string.IsNullOrEmpty(categoryDTO.ThumbUrl))
            {
                string path = _helpersService.GetImageName(categoryDTO.ThumbFile, "categories", category.Slug) ?? throw new Exception("The uploaded file is not a valid image.");
                category.Thumbnail = path;
            }
            else
            {
                string pathExtension = _helpersService.GetFileExtension(categoryDTO.ThumbUrl);
                category.Thumbnail = $"/images/categories/{category.Slug}{pathExtension}"; ;
            }

            //Update database
            await _categoriesRP.UpdateAsync(id, category);
            await _unitOfWork.SaveChangesAsync();

            //Delete file image old and upload file image new old
            //Check if url logo is null or empty
            if (string.IsNullOrEmpty(categoryDTO.ThumbUrl) && categoryDTO.ThumbFile != null)
            {
                if (!string.IsNullOrEmpty(pathImageOld))
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
                await _helpersService.UploadImageAsync(categoryDTO.ThumbFile, category.Thumbnail);
            }
            //Check if url logo is'nt null or empty
            else if (!string.IsNullOrEmpty(categoryDTO.ThumbUrl) && categoryDTO.ThumbFile == null)
            {
                await _helpersService.RenameImageAsync(categoryDTO.ThumbUrl, category.Thumbnail);
            }
            else
            {
                if (!string.IsNullOrEmpty(pathImageOld))
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
            }

            return _mapper.Map<CategoryVM>(category);
        }
    }
}
