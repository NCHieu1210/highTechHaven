using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.Helpers;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class BlogsService : IBlogsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Blog> _blogsRP;
        private readonly IGenericRepository<Post> _post;
        private readonly IHelpersService _helpersService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Injection IUnitOfWork and IUploadFileService
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="uploadFile"></param>
        public BlogsService(IUnitOfWork unitOfWork, IHelpersService helpersService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _blogsRP = unitOfWork.RepositoryBlogs;
            _post = unitOfWork.RepositoryPosts;
            _helpersService = helpersService;
            _mapper = mapper;
        }

        /// <summary>
        /// Create a blog async
        /// </summary>
        /// <param name="blogDTO"></param>
        /// <returns></returns>
        public async Task<BlogVM> CreateAsync(BlogDTO blogDTO)
        {
            var blog = _mapper.Map<Blog>(blogDTO);
            blog.Slug = _helpersService.GenerateSlug(blog.Name);

            //Update database
            await _blogsRP.CreateAsync(blog);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<BlogVM>(blog);
        }

        /// <summary>
        /// Delete a blog async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<BlogVM> DeleteAsync(int id)
        {
            //Find a blog by id
            var existingBlog = await _blogsRP.GetAsync(id);
            if (existingBlog == null)
            {
                return null;
            }
            else
            {
                //Update database
                await _blogsRP.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();
                return _mapper.Map<BlogVM>(existingBlog); ;
            }
        }

        /// <summary>
        /// Delete a range of blogs by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public async Task<ICollection<BlogVM>> DeleteRangeAsync(List<int> idsToDelete)
        {
            Expression<Func<Blog, bool>> filter = blog => idsToDelete.Contains(blog.Id);

            var blogsToDelete = await _blogsRP.GetICollectionAsync(filter);

            if (blogsToDelete.Count != idsToDelete.Count)
            {
                return null;
            }

            await _blogsRP.DeleteRangeAsync(filter);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ICollection<BlogVM>>(blogsToDelete);

        }

        /// <summary>
        /// Get All blogs async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<BlogVM>> GetAllAsync()
        {
            var blogs = await _blogsRP.GetAsync();
            var blogsVM = _mapper.Map<ICollection<BlogVM>>(blogs);
            var includeBlogs = new List<Blog>();
            foreach (var blogVM in blogsVM)
            {
                var includeBlog = await _blogsRP.IncludeEntity(blogVM.Id, b => b.Posts);
                includeBlogs.Add(includeBlog);
                blogVM.QuantityPosts = includeBlog.Posts.Count;
            }
            return blogsVM;
        }

        /// <summary>
        /// Get a blog by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<BlogVM> GetByIdAsync(int id)
        {
            var blog = await _blogsRP.GetAsync(id);
            var includeSupplier = await _blogsRP.IncludeEntity(blog.Id, s => s.Posts);
            var blogVM = _mapper.Map<BlogVM>(blog);
            blogVM.QuantityPosts = includeSupplier.Posts.Count;
            return blogVM;
        }

        /// <summary>
        /// Get a blog by slug async
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public async Task<BlogVM> GetBySlugAsync(string slug)
        {

            var blog = await _blogsRP.GetAsync(b => b.Slug == slug);
            var includeSupplier = await _blogsRP.IncludeEntity(blog.Id, s => s.Posts);
            var blogVM = _mapper.Map<BlogVM>(blog);
            blogVM.QuantityPosts = includeSupplier.Posts.Count;
            return blogVM;
        }

        /// <summary>
        /// Update a blog async
        /// </summary>
        /// <param name="id"></param>
        /// <param name="blogDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<BlogVM> UpdateAsync(int id, BlogDTO blogDTO)
        {
            //Check if supplier is exitst
            var existingBlog = await _blogsRP.GetAsync(id);
            if (existingBlog == null || existingBlog.Id != id)
            {
                throw new Exception("No data maching!");
            }

            var blog = _mapper.Map<Blog>(blogDTO);
            blog.Slug = _helpersService.GenerateSlug(blog.Name);
            blog.Id = id;

            //Update database
            await _blogsRP.UpdateAsync(id, blog);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<BlogVM>(blog);
        }
    }
}
