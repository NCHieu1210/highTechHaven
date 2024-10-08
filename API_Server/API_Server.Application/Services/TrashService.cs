using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class TrashService : ITrashService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Product> _products;
        private readonly IGenericRepository<ProductVariant> _productVariants;
        private readonly IGenericRepository<Post> _posts;
        private readonly IIncludeWithUser<ProductStatus> _includeProductsWithUser;
        private readonly IIncludeWithUser<PostStatus> _includePostsWithUser;
        private readonly IProductExpansionsService _productExpansionsService;
        private readonly IMapper _mapper;

        public TrashService(IUnitOfWork unitOfWork, IMapper mapper, IProductExpansionsService productExpansionsService)
        {
            _unitOfWork = unitOfWork;
            _products = _unitOfWork.RepositoryProducts;
            _productVariants = _unitOfWork.RepositoryProductVariants;
            _posts = _unitOfWork.RepositoryPosts;
            _includeProductsWithUser = _unitOfWork.IncludeProductStatusWithUser;
            _includePostsWithUser = _unitOfWork.IncludePostStatusWithUser;
            _productExpansionsService = productExpansionsService;
            _mapper = mapper;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<TrashVM>> GetAllAsyc()
        {
            //Create product listings and posts in trash
            var trashVM = new List<TrashVM>();

            //Get all deleted products
            var products = await _products.GetICollectionAsync(p => p.ProductStatus.Any(pS => pS.Name == Name.Deleted));
            if (products.Any())
            {
                //Include product
                products = await _products.IncludeEntities(products.Select(p => (object)p.Id), p => p.ProductStatus);
                foreach (var product in products)
                {
                    //Get a status has name is Deleted
                    var productStatusDeleted = product.ProductStatus.SingleOrDefault(pS => pS.Name == Name.Deleted);
                    //Get product varinats by product id
                    var variant = (await _productExpansionsService.GetVariantsByProductIdAsync(product.Id))
                                         .SingleOrDefault(pV => pV.IsDefault == true);

                    //Include ProductSatatus and ProductVariant
                    productStatusDeleted = await _includeProductsWithUser.GetGenericWithUserAsync(productStatusDeleted.Id);
                    variant = await _productVariants.IncludeEntity(variant.Id, pV => pV.ProductImage);

                    //Map data from product to the trashVM
                    var productInTrash = _mapper.Map<TrashVM>(product);
                    productInTrash.Thumbnail = variant.ProductImage.Image;
                    productInTrash.UserDeletedID = productStatusDeleted.User.Id;
                    productInTrash.UserFullName = $"{productStatusDeleted.User.FirstName} {productStatusDeleted.User.FirstName}";
                    productInTrash.DeletedDate = productStatusDeleted.Date;

                    //Add product to list
                    trashVM.Add(productInTrash);
                }
            }
            //Get all deleted posts
            var posts = await _posts.GetICollectionAsync(p => p.PostStatus.Any(p => p.Name == Name.Deleted));
            if(posts.Any())
            {
                posts = await _posts.IncludeEntities(posts.Select(p => (object)p.Id), p => p.PostStatus);
                foreach (var post in posts)
                {
                    //Get a status has name is Deleted
                    var postStatusDeleted = post.PostStatus.SingleOrDefault(pS => pS.Name == Name.Deleted);

                    //Include the user entity from ProductStatus
                    postStatusDeleted = await _includePostsWithUser.GetGenericWithUserAsync(postStatusDeleted.Id);

                    //Map data from post to the trashVM
                    var postInTrash = _mapper.Map<TrashVM>(post);
                    postInTrash.UserDeletedID = postStatusDeleted.User.Id;
                    postInTrash.UserFullName = $"{postStatusDeleted.User.FirstName} {postStatusDeleted.User.FirstName}";
                    postInTrash.DeletedDate = postStatusDeleted.Date;

                    //Add to list 
                    trashVM.Add(postInTrash);
                }
            }    
            return trashVM;
        }

        public Task<TrashVM> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

    }
}
