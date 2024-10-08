using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.Helpers;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class PostsService : IPostsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Post> _postRP;
        private readonly IGenericRepository<PostStatus> _postStatusRP;
        private readonly IGenericRepository<Blog> _blogRP;
        private readonly ILikedService _likedService;
        private readonly IIncludeWithUser<PostStatus> _includeWithUser;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHelpersService _helpersService;
        private readonly IUsersRepository _usersRP;

        public PostsService(IUnitOfWork unitOfWork, IMapper mapper, IHelpersService helpersService,
            IHttpContextAccessor httpContextAccessor, ILikedService likedService, IUsersRepository usersRP)
        {
            _unitOfWork = unitOfWork;
            _postRP = _unitOfWork.RepositoryPosts;
            _postStatusRP = _unitOfWork.RepositoryPostStatus;
            _blogRP = _unitOfWork.RepositoryBlogs;
            _includeWithUser = _unitOfWork.IncludePostStatusWithUser;
            _likedService = likedService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _helpersService = helpersService;
            _usersRP = usersRP;
        }

        /// <summary>
        /// Create a post async
        /// </summary>
        /// <param name="postDTO"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<PostVM> CreateAsync(PostDTO postDTO)
        {
            using (var transaction =  await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    //STEP 1: Create Post
                    var post = _mapper.Map<Post>(postDTO);
                    post.Slug = _helpersService.GenerateSlug(post.Name);
                    if (string.IsNullOrEmpty(post.Content))
                    {
                        post.Content = "Không có nội dung";
                    }
                    //Generate path
                    string path = _helpersService.GetImageName(postDTO.ThumbFile, "posts", post.Slug) 
                                ?? throw new Exception("The uploaded file is not a valid image!");
                    post.Thumbnail = path;

                    //Update Database
                    await _postRP.CreateAsync(post);
                    await _unitOfWork.SaveChangesAsync();

                    //STEP 2: Create PostStatus
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
                    var postStatus = new PostStatus
                    {
                        Name = Name.Created,
                        PostID = post.Id,
                        UserID = userId,
                    };
                    //Update Database
                    await _postStatusRP.CreateAsync(postStatus);
                    await _unitOfWork.SaveChangesAsync();
                    //Commit transaction
                    await _unitOfWork.CommitTransactionAsync();

                    //STEP 3: Upload Post thumbnail
                    await _helpersService.UploadImageAsync(postDTO.ThumbFile, path);

                    //STEP 4:
                    var user = await _usersRP.GetAsync(userId);
                    user.NumberPosts += 1;
                    await _usersRP.UpdateAsync(userId, user);
                    await _unitOfWork.SaveChangesAsync();

                    //STEP 5: Retunr data
                    return _mapper.Map<PostVM>(post);

                }
                catch (Exception ex)
                {
                    //Rollback transaction
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }
            }
        }

        /// <summary>
        /// Delete a post async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<PostVM> DeleteAsync(int id)
        {
            //Find a product by id
            var existingPost = await _postRP.GetAsync(id);
            if(existingPost == null)
            {
                return null;
            }   
            existingPost = await _postRP.IncludeEntity(existingPost.Id, p => p.PostStatus) ;
            if (existingPost.PostStatus.All(pS => pS.Name != Name.Deleted))
            {
                var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

                //Include data
                var postStatus = new PostStatus()
                {
                    UserID = userId,
                    PostID = existingPost.Id,
                    Name = Name.Deleted,
                };
                //Update database
                await _postStatusRP.CreateAsync(postStatus);
                await _unitOfWork.SaveChangesAsync();

                return _mapper.Map<PostVM>(existingPost);
            }
            return null;
        }

        /// <summary>
        /// Delete a range of post by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public async Task<ICollection<PostVM>> DeleteRangeAsync(List<int> idsToDelete)
        {
            Expression<Func<Post, bool>> filter = post => idsToDelete.Contains(post.Id);

            var postsToDelete = await _postRP.GetICollectionAsync(filter);
            postsToDelete = await _postRP.IncludeEntities(postsToDelete.Select(p => (object)p.Id), p => p.PostStatus);
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

            if (postsToDelete.Count != idsToDelete.Count)
            {
                return null;
            }
            var listPostStatus = new List<PostStatus>();
            foreach (var post in postsToDelete)
            {
                if (post.PostStatus.All(pS => pS.Name != Name.Deleted))
                {
                    //Include data
                    var postStatus = new PostStatus()
                    {
                        UserID = userId,
                        PostID = post.Id,
                        Name = Name.Deleted,
                    };
                    //Update database
                    listPostStatus.Add(postStatus);
                }
            }
            await _postStatusRP.CreateRangeAsync(listPostStatus);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ICollection<PostVM>>(postsToDelete);
        }

        /// <summary>
        /// Get all post async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<PostVM>> GetAllAsync()
        {
            var posts = await _postRP.GetICollectionAsync(p => p.Status == true && p.PostStatus.All( pS => pS.Name != Name.Deleted));
            //Include data
            posts = await _postRP.IncludeEntities(posts.Select(p => (object)p.Id),
                                                               p => p.Blog,
                                                               p => p.PostStatus);
            foreach(var post in posts)
            {
                post.PostStatus = await _includeWithUser.GetGenericWithUserAsync(post.PostStatus.Select(pS => pS.Id).ToList());
            }
            return _mapper.Map<ICollection<PostVM>>(posts);
        }

        /// <summary>
        /// Get posts by blogs async
        /// </summary>
        /// <param name="blogsId"></param>
        /// <returns></returns>
        public async Task<ICollection<PostVM>> GetByBlogsAsync(int blogsId)
        {
            var posts = await _postRP.GetICollectionAsync(p => p.BlogID == blogsId && 
                                                          p.Status == true && 
                                                          p.PostStatus.All(pS => pS.Name != Name.Deleted));
            //Include data
            posts = await _postRP.IncludeEntities(posts.Select(p => (object)p.Id),
                                                               p => p.Blog,
                                                               p => p.PostStatus);
            foreach (var post in posts)
            {
                post.PostStatus = await _includeWithUser.GetGenericWithUserAsync(post.PostStatus.Select(pS => pS.Id).ToList());
            }
            return _mapper.Map<ICollection<PostVM>>(posts);
        }

        /// <summary>
        /// Get a post by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<PostVM> GetByIdAsync(int id)
        {
            var post = await _postRP.GetAsync(id);
            post = await _postRP.IncludeEntity(post.Id, 
                                               p => p.Blog,
                                               p => p.PostStatus);
            if (post.Status == true && post.PostStatus.All(pS => pS.Name != Name.Deleted) && post != null)
            {
                //Include and return data
                var postVM = _mapper.Map<PostVM>(post);
                postVM.QuantityLiked = await _likedService.GetQuantityLikedByPostAsync(post.Id);
                return postVM;
            }
            return null;
        }

        /// <summary>
        /// Get post by search
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<ICollection<PostVM>> GetBySearchAsync(string search)
        {
            Expression<Func<Post, bool>> filter = post => post.Name.Contains(search);
            var posts = await _postRP.GetICollectionAsync(filter);
            posts = await _postRP.IncludeEntities(posts.Select(p => (object)p.Id), p => p.PostStatus, p => p.Blog);
             //Include data
            foreach (var post in posts)
            {
                post.PostStatus = await _includeWithUser.GetGenericWithUserAsync(post.PostStatus.Select(p => p.Id).ToList());
            }
            return _mapper.Map<ICollection<PostVM>>(posts);
        }

        /// <summary>
        /// Get by slug
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public async Task<PostVM> GetBySlugAsync(string slug)
        {
            var post = await _postRP.GetAsync(p => p.Slug == slug);
            post = await _postRP.IncludeEntity(post.Id,
                                               p => p.Blog,
                                               p => p.PostStatus);
            post.PostStatus = await _includeWithUser.GetGenericWithUserAsync(post.PostStatus.Select(p => p.Id).ToList());
            if (post.Status == true && post.PostStatus.All(pS => pS.Name != Name.Deleted) && post != null)
            {
                //Include and return data
                post.Views += 1;
                await _postRP.UpdateAsync(post.Id, post);
                await _unitOfWork.SaveChangesAsync();

                var postVM = _mapper.Map<PostVM>(post);
                postVM.QuantityLiked = await _likedService.GetQuantityLikedByPostAsync(post.Id);
                return postVM;
            }
            return null;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<PostVM> RestorePostAsync(int id)
        {
            var postInTrash = await _postRP.GetAsync(id);
            if (postInTrash == null)
            {
                return null;
            }
            postInTrash = await _postRP.IncludeEntity(postInTrash.Id, pS => pS.PostStatus);
            var checkStatusDeleted = postInTrash.PostStatus.SingleOrDefault(p => p.Name == Name.Deleted);
            if (checkStatusDeleted != null)
            {
                //Update database
                await _postStatusRP.DeleteAsync(checkStatusDeleted.Id);
                await _unitOfWork.SaveChangesAsync();

                //Include data
                return _mapper.Map<PostVM>(postInTrash);
            }
            return null;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="idsToRestore"></param>
        /// <returns></returns>
        public async Task<ICollection<PostVM>> RestoreRangePostsAsync(List<int> idsToRestore)
        {
            Expression<Func<Post, bool>> filter = post => idsToRestore.Contains(post.Id);

            var postsToDelete = await _postRP.GetICollectionAsync(filter);
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

            if (postsToDelete.Count != idsToRestore.Count)
            {
                return null;
            }
            var listPostIsRestoreId = new List<int>();
            postsToDelete = await _postRP.IncludeEntities(postsToDelete.Select(p => (object)p.Id), p => p.PostStatus);

            foreach (var post in postsToDelete)
            {
                var checkStatusDeleted = post.PostStatus.SingleOrDefault(p => p.Name == Name.Deleted);
                if(checkStatusDeleted != null)
                {
                    listPostIsRestoreId.Add(checkStatusDeleted.Id);
                }    
            }

            if (postsToDelete.Count != listPostIsRestoreId.Count)
            {
                return null;
            }

            await _postStatusRP.DeleteRangeAsync(p => listPostIsRestoreId.Contains(p.Id));
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ICollection<PostVM>>(postsToDelete);
        }

        /// <summary>
        /// Permanently delete a product async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<PostVM> PermanentlyDeleted(int id)
        {
            var existingPost = await _postRP.GetAsync(id);
            existingPost = await _postRP.IncludeEntity(existingPost.Id, p => p.PostStatus);
            if (existingPost == null || existingPost.PostStatus.All(pS => pS.Name != Name.Deleted))
            {
                return null;
            }
            else
            {
                //Update database
                await _postRP.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                //Delete file Image
                if (!string.IsNullOrEmpty(existingPost.Thumbnail))
                {
                    await _helpersService.DeleteImageAsync(existingPost.Thumbnail);
                }

                return _mapper.Map<PostVM>(existingPost); ;
            }
        }

        public async Task<PostVM> UpdateAsync(int id, PostDTO postDTO)
        {
            if (!string.IsNullOrEmpty(postDTO.ThumbUrl) && postDTO.ThumbFile != null)
            {
                throw new Exception("Input data is incorrect!");
            }

            //Check if product is exitst
            var existingPost = await _postRP.GetAsync(id);
            if (existingPost == null || existingPost.Id != id)
            {
                throw new Exception("No data maching!");
            }
            string pathImageOld = existingPost.Thumbnail;

            var post = _mapper.Map<Post>(postDTO);

            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

                    //STEP 1: Update post
                    //Assign values from findP( product in database) to the product( map from productDTO)
                    post.Id = existingPost.Id;
                    post.Slug = _helpersService.GenerateSlug(post.Name);
                    post.Views = existingPost.Views;
                    if (postDTO.ThumbFile != null && string.IsNullOrEmpty(postDTO.ThumbUrl))
                    {
                        post.Thumbnail = _helpersService.GetImageName(postDTO.ThumbFile, "posts", post.Slug)
                                       ?? throw new Exception("The uploaded file is not a valid image.");
                    }
                    else
                    {
                        post.Thumbnail = existingPost.Thumbnail;
                    }
                    await _postRP.UpdateAsync(post.Id, post);

                    //STEP 2: Update ProductStatus
                    post = await _postRP.IncludeEntity(post.Id, p => p.PostStatus);
                    var postStatusUpdated = post.PostStatus.SingleOrDefault(pS => pS.Name == Name.Updated);
                    if (postStatusUpdated != null)
                    {
                        postStatusUpdated.Date = DateTime.UtcNow;
                        await _postStatusRP.UpdateAsync(postStatusUpdated.Id, postStatusUpdated);
                    }
                    else
                    {
                        postStatusUpdated = new PostStatus()
                        {
                            UserID = userId,
                            PostID = post.Id,
                            Name = Name.Updated,
                        };
                        //Update database
                        await _postStatusRP.CreateAsync(postStatusUpdated);
                    }

                    await _unitOfWork.SaveChangesAsync();
                    await _unitOfWork.CommitTransactionAsync();
                }
                catch (Exception ex)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }

                //Delete file image old and upload file image new old
                //Check if url logo is null or empty
                if ((postDTO.ThumbFile != null && string.IsNullOrEmpty(postDTO.ThumbUrl)) || 
                    (postDTO.ThumbFile == null && string.IsNullOrEmpty(postDTO.ThumbUrl)))
                {
                    if (!string.IsNullOrEmpty(pathImageOld))
                    {
                        await _helpersService.DeleteImageAsync(pathImageOld);
                    }
                    await _helpersService.UploadImageAsync(postDTO.ThumbFile, post.Thumbnail);
                }

                return _mapper.Map<PostVM>(post);
            }
        }
    }
}
