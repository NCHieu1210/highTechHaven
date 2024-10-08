using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.Helpers;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{

    public class ProductsService : IProductsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Product> _productRP;
        private readonly IGenericRepository<ProductColor> _productColorRP;
        private readonly IGenericRepository<ProductImage> _productImageRP;
        private readonly IGenericRepository<ProductOption> _productOptionRP;
        private readonly IGenericRepository<ProductOptionType> _productOptionTypeRP;
        private readonly IGenericRepository<ProductStatus> _productStatusRP;
        private readonly IGenericRepository<ProductVariant> _productVariantRP;
        private readonly IGenericRepository<Category> _categoryRP;
        private readonly IGenericRepository<Supplier> _supplierRP;
        private readonly IIncludeWithUser<ProductStatus> _includeWithUser;
        private readonly IUsersRepository _userRP;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHelpersService _helpersService;
        private readonly IUsersRepository _usersRP;
        private readonly IMapper _mapper;
        private readonly IProductExpansionsService _productExpansionsService;
        private readonly IReviewsService _reviewsService;

        public ProductsService(IUnitOfWork unitOfWork, IMapper mapper, IHelpersService helpersService,
            IProductExpansionsService productExpansionsService, IReviewsService reviewsService,
            IHttpContextAccessor httpContextAccessor, IUsersRepository usersRP)
        {
            _unitOfWork = unitOfWork;
            _productRP = _unitOfWork.RepositoryProducts;
            _productColorRP = _unitOfWork.RepositoryProductColors;
            _productImageRP = _unitOfWork.RepositoryProductImages;
            _productOptionRP = _unitOfWork.RepositoryProductOptions;
            _productOptionTypeRP = _unitOfWork.RepositoryProductOptionTypes;
            _productStatusRP = _unitOfWork.RepositoryProductStatus;
            _productVariantRP = _unitOfWork.RepositoryProductVariants;
            _categoryRP = _unitOfWork.RepositoryCategories;
            _supplierRP = _unitOfWork.RepositorySuppliers;
            _includeWithUser = _unitOfWork.IncludeProductStatusWithUser;
            _userRP = _unitOfWork.RepositoryUsers;
            _mapper = mapper;
            _productExpansionsService = productExpansionsService;
            _reviewsService = reviewsService;
            _httpContextAccessor = httpContextAccessor;
            _helpersService = helpersService;
            _usersRP = usersRP;
        }

        /// <summary>
        /// Get all products by custumer role async
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="productImageDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<ICollection<ProductsVM>> GetAllProductsByCustumerAsync()
        {

            var getProducts = await _productRP.GetICollectionAsync(p => p.Status == true && 
                                                                        p.ProductStatus.All(pS => pS.Name != Name.Deleted));

            //Do not add to the list if the products is deleted and include Products
            var products = await _productRP.IncludeEntities(getProducts.Select(p => (object)p.Id),
                                                            p => p.Category,
                                                            p => p.Supplier,
                                                            p => p.ProductStatus);

            var productsVM = _mapper.Map<ICollection<ProductsVM>>(products);
            foreach (var productVM in productsVM) {
                var productVariants = await _productExpansionsService.GetVariantsByProductIdAsync(productVM.Id);
                productVM.TotalStock = productVariants.Sum(p => p.Stock);
                productVM.TotalSellNumbers = productVariants.Sum(p => p.SellNumbers);
                productVM.ProductVariants = _mapper.Map<ProductVariantVM>(productVariants.SingleOrDefault(pv => pv.IsDefault == true));
                productVM.TotalRating = await _reviewsService.GetAverageRatingByProductId(productVM.Id);
            }
            return productsVM;
        }

        /// <summary>
        /// Get all products by admin role async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<ProductsVM>> GetAllProductsByAdminAsync()
        {
            var getProducts = await _productRP.GetICollectionAsync(p => p.ProductStatus.All(pS => pS.Name != Name.Deleted));
            //Do not add to the list if the products is deleted and include Products
            var products = await _productRP.IncludeEntities(getProducts.Select(p => (object)p.Id),
                                                            p => p.Category,
                                                            p => p.Supplier,
                                                            p => p.ProductStatus);
            var productsVM = _mapper.Map<ICollection<ProductsVM>>(products);
            foreach (var productVM in productsVM)
            {
                var productVariants = await _productExpansionsService.GetVariantsByProductIdAsync(productVM.Id);
                productVM.TotalStock = productVariants.Sum(p => p.Stock);
                productVM.TotalSellNumbers = productVariants.Sum(p => p.SellNumbers);
                productVM.TotalVariants = productVariants.Count();
                productVM.ProductVariants = _mapper.Map<ProductVariantVM>(productVariants.SingleOrDefault(pv => pv.IsDefault == true));
                productVM.TotalRating = await _reviewsService.GetAverageRatingByProductId(productVM.Id);
            }
            return productsVM;
        }


        /// <summary>
        /// Get a product by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ProductsVM> GetProductByIdAsync(int id)
        {
            var product = await _productRP.GetAsync(p => p.Id == id);
            product = await _productRP.IncludeEntity(product.Id, p => p.Supplier,
                                                                 p => p.Category, 
                                                                 p => p.ProductStatus,
                                                                 p => p.ProductOptions);
            var productVM = _mapper.Map<ProductsVM>(product);
            var variant = (await _productExpansionsService.GetVariantsByProductIdAsync(productVM.Id)).SingleOrDefault(pV => pV.IsDefault == true);
            productVM.ProductVariants = _mapper.Map<ProductVariantVM>(variant);
            return productVM;
        }

        /// <summary>
        /// Get a product by variant id async
        /// </summary>
        /// <param name="productVariantId"></param>
        /// <returns></returns>
        public async Task<ProductsVM> GetProductByVariantIdAsync(int productVariantId)
        {
            var variant = await _productExpansionsService.GetProductVariantByIdAsync(productVariantId) ?? throw new Exception("No data maching!");
            var variantVM = _mapper.Map<ProductVariantVM>(variant);
            var productOption = await _productOptionRP.GetAsync(p => p.Id == variantVM.OptionID);
            var product = (await _productOptionRP.IncludeEntity(productOption.Id, pO => pO.Product)).Product;
            var productVM = _mapper.Map<ProductsVM>(product);
            productVM.ProductVariants = variantVM;
            return productVM;
        }


        /// <summary>
        /// Get a product by slug async
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public async Task<ProductDetailVM> GetProductBySlugAsync(string slug)
        {
            var product = await _productRP.GetAsync(p => p.Slug == slug);
            product = await _productRP.IncludeEntity( product.Id, p => p.Supplier, 
                                                                  p => p.Category, 
                                                                  p => p.ProductOptions,
                                                                  p => p.ProductStatus,
                                                                  p => p.ProductImages);

            product.ProductOptions = await _productOptionRP.IncludeEntities(product.ProductOptions.Select(pO => (Object)pO.Id),
                                                                            pO => pO.ProductOptionType);

            product.ProductStatus = await _includeWithUser.GetGenericWithUserAsync(product.ProductStatus.Select(pS => pS.Id).ToList());
            product.ProductImages = product.ProductImages.Where(pI => pI.IsThumbnail == false).ToList();


            var productVM = _mapper.Map<ProductDetailVM>(product);
            int totalStock = 0;
            int totalSellNumbers = 0;
            foreach (var productOption in productVM.ProductOptions)
            {
                productOption.Rating = await _reviewsService.GetRatingByProductOptionId(productOption.Id);
                productOption.ProductVariants = await _productExpansionsService.GetVariantsByProductOptionIdAsync(productOption.Id);
                totalStock += productOption.ProductVariants.Sum(pV => pV.Stock);
                totalSellNumbers += productOption.ProductVariants.Sum(pV => pV.SellNumbers);
            }
            productVM.TotalStock = totalStock;
            productVM.TotalSellNumbers = totalSellNumbers;
            productVM.TotalRating = await _reviewsService.GetAverageRatingByProductId(productVM.Id);
            return productVM;
        }

        /// <summary>
        /// Get collection products by product option id async
        /// </summary>
        /// <param name="productOptionId"></param>
        /// <returns></returns>
        public async Task<ICollection<ProductsVM>> GetProductByCollectionProductOptionIdAsync(List<int> productOptionId)
        {
            var products = await _productRP.GetICollectionAsync(p => p.Id == p.ProductOptions
                                           .FirstOrDefault(pO => productOptionId.Contains(pO.Id)).ProductID);
            var productsVM = new List<ProductsVM>();
            foreach (var product in products)
            {
                var variant = (await _productExpansionsService.GetVariantsByProductIdAsync(product.Id))
                                                              .SingleOrDefault(v => v.IsDefault == true);
                var variantVM = _mapper.Map<ProductVariantVM>(variant);
                var productVM = _mapper.Map<ProductsVM>(product);
                productVM.ProductVariants = variantVM;
                productsVM.Add(productVM);
            }
            return productsVM;
        }

        /// <summary>
        /// Get a product by slug combined with options product and color async
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="option"></param>
        /// <param name="color"></param>
        /// <returns></returns>
        public async Task<ProductVariantBySlugVM> GetVariantBySlugAsync(string slug, string option, string color)
        {
            //Get product by slug
            var product = await _productRP.GetAsync(p => p.Slug == slug) ?? throw new Exception("No data mahching!");

            Expression<Func<ProductVariant, bool>> filter = pV => pV.ProductOption.ProductID == product.Id 
                                                               && pV.ProductOption.ProductOptionType.Option == option;
            
            if(!string.IsNullOrEmpty(color))
            {
                filter = pV  => pV.ProductOption.ProductID == product.Id 
                             && pV.ProductOption.ProductOptionType.Option == option
                             && pV.ProductColor.Color == color;
            }

            //Get ProductVariant by ProductOptionID, Option name and color
            var variant = await _productVariantRP.GetAsync(filter) ?? throw new Exception("No data mahching!");
            //Include ProductVariant
            variant = await _productVariantRP.IncludeEntity(variant.Id, pV => pV.ProductOption.ProductOptionType,
                                                                        pV => pV.ProductColor,
                                                                        pV => pV.ProductImage);

            //Include Product and ProductOptions
            product = await _productRP.IncludeEntity(product.Id, p => p.ProductOptions, 
                                                                 p => p.ProductImages,
                                                                 p => p.Category,
                                                                 p => p.Supplier);
            product.ProductOptions = await _productOptionRP.IncludeEntities(product.ProductOptions.Select(pO => (object)pO.Id),
                                                                            pO => pO.ProductOptionType);

            product.ProductImages = product.ProductImages.Where(pI => pI.IsThumbnail == false).ToList();

            //Map data from entiry to the ViewModel
            var variantVM = _mapper.Map<ProductVariantVM>(variant);
            var productVM = _mapper.Map<ProductVariantBySlugVM>(product);

            productVM.ProductVariant = variantVM;

            //Get varinant in ProdctOption and map data to the ViewModel
            foreach (var productOption in productVM.ProductOptions)
            {
                var variants = await _productExpansionsService.GetVariantsByProductOptionIdAsync(productOption.Id);
                var variantsVM = _mapper.Map<ICollection<VariantBySlugVM>>(variants);
                productOption.Variants = variantsVM;
            }
            return productVM;
        }

        /// <summary>
        /// Get by range categories and suppliers asyncGet by range categories and suppliers async
        /// </summary>
        /// <param name="idsCategories"></param>
        /// <param name="idsSupplies"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ICollection<ProductsVM>> GetProductsByRangeCategoriesAndSuppliersAsync(List<int> idsCategories, List<int> idsSupplies)
        {
            //Get UserID by token
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var user = await _userRP.GetAsync(userID);

            //Check role
            string[] roles = { $"{UserRole.Admin}", $"{UserRole.Marketing}", $"{UserRole.StoreManager}" };
            bool isDisplayAll = false;
            if (userID != null && user.Roles.Any(r => roles.Contains(r)))
            {
                isDisplayAll = true;
            }

            //Generate filter and filter data by roles
            Expression<Func<Product, bool>> filter = isDisplayAll ? 
                (product => product.CategoryID.HasValue && idsCategories.Contains(product.CategoryID.Value) &&
              product.SupplierID.HasValue && idsSupplies.Contains(product.SupplierID.Value) && product.Status == true): 

                (product => product.CategoryID.HasValue && idsCategories.Contains(product.CategoryID.Value) &&
              product.SupplierID.HasValue && idsSupplies.Contains(product.SupplierID.Value));

            //Get products by filter
            var products = await _productRP.GetICollectionAsync(filter);

            //Include products
            products = await _productRP.IncludeEntities(products.Select(p => (Object)p.Id),
                                                        p => p.Category,
                                                        p => p.Supplier,
                                                        p => p.ProductStatus);

            //Filter data by roles
            products = isDisplayAll ? products : products.Where(p => !p.ProductStatus.Any(pS => pS.Name == Name.Deleted)).ToList();

            //Get product variants
            var productsVM = _mapper.Map<ICollection<ProductsVM>>(products);
            foreach (var productVM in productsVM) {
                var variant = (await _productExpansionsService.GetVariantsByProductIdAsync(productVM.Id)).SingleOrDefault(pV => pV.IsDefault == true);
                productVM.ProductVariants = _mapper.Map<ProductVariantVM>(variant);
            }

            return productsVM;
        }

        /// <summary>
        /// Get by range categories async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ICollection<ProductsVM>> GetProductsByRangeCategoriesAsync(List<int> ids)
        {
            //Get UserID by token
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var user = await _userRP.GetAsync(userID);

            //Check role
            string[] roles = { $"{UserRole.Admin}", $"{UserRole.Marketing}", $"{UserRole.StoreManager}" };
            bool isDisplayAll = false;
            if (userID != null && user.Roles.Any(r => roles.Contains(r)))
            {
                isDisplayAll = true;
            }

            //Generate filter and filter data by roles
            Expression<Func<Product, bool>> filter = isDisplayAll ?
                (product => product.CategoryID.HasValue && ids.Contains(product.CategoryID.Value) && product.Status == true) :
                (product => product.CategoryID.HasValue && ids.Contains(product.CategoryID.Value));

            //Get products by filter
            var products = await _productRP.GetICollectionAsync(filter);

            //Include products
            products = await _productRP.IncludeEntities(products.Select(p => (Object)p.Id),
                                                        p => p.Category,
                                                        p => p.Supplier,
                                                        p => p.ProductStatus);

            //Filter data by roles
            products = isDisplayAll ? products : products.Where(p => !p.ProductStatus.Any(pS => pS.Name == Name.Deleted)).ToList();

            //Get product variants
            var productsVM = _mapper.Map<ICollection<ProductsVM>>(products);
            foreach (var productVM in productsVM)
            {
                var variant = (await _productExpansionsService.GetVariantsByProductIdAsync(productVM.Id)).SingleOrDefault(pV => pV.IsDefault == true);
                productVM.ProductVariants = _mapper.Map<ProductVariantVM>(variant);
            }

            return productsVM;
        }

        /// <summary>
        ///  Get by range suppliers async
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ICollection<ProductsVM>> GetProductsByRangeSuppliersAsync(List<int> ids)
        {
            //Get UserID by token
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var user = await _userRP.GetAsync(userID);

            //Check role
            string[] roles = { $"{UserRole.Admin}", $"{UserRole.Marketing}", $"{UserRole.StoreManager}" };
            bool isDisplayAll = false;
            if (userID != null && user.Roles.Any(r => roles.Contains(r)))
            {
                isDisplayAll = true;
            }

            //Generate filter and filter data by roles
            Expression<Func<Product, bool>> filter = isDisplayAll ?
                (product => product.SupplierID.HasValue && ids.Contains(product.SupplierID.Value) && product.Status == true) :
                (product => product.SupplierID.HasValue && ids.Contains(product.SupplierID.Value));

            //Get products by filter
            var products = await _productRP.GetICollectionAsync(filter);

            //Include products
            products = await _productRP.IncludeEntities(products.Select(p => (Object)p.Id),
                                                        p => p.Category,
                                                        p => p.Supplier,
                                                        p => p.ProductStatus);

            //Filter data by roles
            products = isDisplayAll ? products : products.Where(p => !p.ProductStatus.Any(pS => pS.Name == Name.Deleted)).ToList();

            //Get product variants
            var productsVM = _mapper.Map<ICollection<ProductsVM>>(products);
            foreach (var productVM in productsVM)
            {
                var variant = (await _productExpansionsService.GetVariantsByProductIdAsync(productVM.Id)).SingleOrDefault(pV => pV.IsDefault == true);
                productVM.ProductVariants = _mapper.Map<ProductVariantVM>(variant);
            }

            return productsVM;
        }

        #region Search product
        /// <summary>
        /// Get products by search
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<ICollection<ProductsVM>> GetProductsBySearchAsync(string search)
        {
            var resultProducts = new List<ProductsVM>();
            var searchTerm = search.Trim().ToUpper();

            Expression<Func<Product, bool>> filter = product => searchTerm.Contains(product.Name.Trim().ToUpper()) ||
                                                                product.Name.Trim().ToUpper().Contains(searchTerm);

            var products = await _productRP.GetICollectionAsync(filter);
            if (!products.Any())
            {
                var filterProduc = BuildFilter(searchTerm);
                products = await _productRP.GetICollectionAsync(filterProduc);
                if (!products.Any())
                {
                    throw new Exception("No data matching!");
                }    
            }

            products = await _productRP.IncludeEntities(products.Select(p => (object)p.Id),
                                                         p => p.Category,
                                                         p => p.Supplier,
                                                         p => p.ProductOptions);

            var productsVM = _mapper.Map<ICollection<ProductsVM>>(products);

            foreach (var productVM in productsVM)
            {
                await ProcessProductVariants(productVM, searchTerm, resultProducts);
            }

            return resultProducts;
        }

        private Expression<Func<Product, bool>> BuildFilter(string searchTerm)
        {
            return product =>
                   searchTerm.Contains(product.Name.Trim().ToUpper()) ||
                   product.Name.Trim().ToUpper().Contains(searchTerm) ||
                   searchTerm.Contains(product.Supplier.Name.Trim().ToUpper()) ||
                   product.Supplier.Name.Trim().ToUpper().Contains(searchTerm) ||
                   searchTerm.Contains(product.Category.Name.Trim().ToUpper()) ||
                   product.Category.Name.Trim().ToUpper().Contains(searchTerm) ||
                   product.ProductOptions.Any(pO => searchTerm.Contains(pO.ProductOptionType.Option.Trim().ToUpper())) ||
                   product.ProductOptions.Any(pO => pO.ProductOptionType.Option.Trim().ToUpper().Contains(searchTerm)) ||
                   product.ProductOptions.Any(pO => pO.ProductVariants.Any(pV => searchTerm.Contains(pV.ProductColor.Color.Trim().ToUpper()))) ||
                   product.ProductOptions.Any(pO => pO.ProductVariants.Any(pV => pV.ProductColor.Color.Trim().ToUpper().Contains(searchTerm)));
        }

        private async Task ProcessProductVariants(ProductsVM productVM, string searchTerm, List<ProductsVM> resultProducts)
        {
            var variants = await _productExpansionsService.GetVariantsByProductIdAsync(productVM.Id);
            var searchOption = variants.Where(pO => searchTerm.Contains(pO.ProductOption.ProductOptionType.Option.Trim().ToUpper()) ||
                                                    pO.ProductOption.ProductOptionType.Option.Trim().ToUpper().Contains(searchTerm));

            var searchColor = searchOption.Where(pO => searchTerm.Contains(pO.ProductColor.Color.Trim().ToUpper()) ||
                                                       pO.ProductColor.Color.Trim().ToUpper().Contains(searchTerm));

            if (searchColor.Any() || searchOption.Any())
            {
                foreach (var variant in searchColor.Any() ? searchColor : searchOption)
                {
                    await AddVariantToResult(productVM, variant, resultProducts);
                }
            }
            else
            {
                var defaultColorSearch = variants.Where(pO => searchTerm.Contains(pO.ProductColor.Color.Trim().ToUpper()) ||
                                                               pO.ProductColor.Color.Trim().ToUpper().Contains(searchTerm));
                foreach (var variant in defaultColorSearch.Any() ? defaultColorSearch : variants)
                {
                    await AddVariantToResult(productVM, variant, resultProducts);
                }
            }
        }

        private async Task AddVariantToResult(ProductsVM productVM, ProductVariant variant, List<ProductsVM> resultProducts)
        {
            var productClone = productVM.Clone();
            productClone.ProductVariants = _mapper.Map<ProductVariantVM>(variant);
            productClone.TotalRating = await _reviewsService.GetRatingByProductOptionId(productClone.ProductVariants.OptionID);
            resultProducts.Add(productClone);
        }
        #endregion

        /// <summary>
        /// Change product status by id async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async Task<ProductsVM> ChangeProductStatusAsync(int productId)
        {
            var existingProduct = await _productRP.GetAsync(productId) ?? throw new Exception("No data matching!");
            existingProduct.Status = !existingProduct.Status;

            await _productRP.UpdateAsync(existingProduct.Id, existingProduct);
            await _unitOfWork.SaveChangesAsync();

            var product = await GetProductByIdAsync(existingProduct.Id);
            return product;
        }


        /// <summary>
        /// Create product
        /// </summary>
        /// <param name="productDTO"></param>
        /// <param name="variantDTOs"></param>
        /// <param name="imageDTOs"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<ProductsVM> 
            CreateProductAsync(
            ProductDTO productDTO,
            ICollection<ProductVariantDTO> variantDTOs,
            ProductImageDTO imageDTOs)
        {
            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    //===== STEP 1: Create Product =====
                    var product = _mapper.Map<Product>(productDTO);
                    //Generate Slug
                    product.Slug = _helpersService.GenerateSlug(product.Name);
                    //Create and update product into the database
                    await _productRP.CreateAsync(product);
                    await _unitOfWork.SaveChangesAsync();

                    //===== STEP 2: Create ProductStatus =====
                    var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
                    var productStatus = new ProductStatus()
                    {
                        Name = Name.Created,
                        ProductID = product.Id,
                        UserID = userID,
                    };
                    await _productStatusRP.CreateAsync(productStatus);
                    await _unitOfWork.SaveChangesAsync();

                    //===== STEP 3: Create ProducutVariant =====
                    await _productExpansionsService.CreateProductVariantsAsync(product, variantDTOs);

                    //===== STEP 4: Create ProductImage =====
                    await _productExpansionsService.CreateProductImageAsync(product.Id, imageDTOs);

                    //===== STEP 5:=====
                    var userId = _httpContextAccessor.HttpContext.User.FindFirst("UserId")?.Value;
                    var user = await _usersRP.GetAsync(userId);
                    user.NumberProducts += 1;
                    await _usersRP.UpdateAsync(userId, user);
                    await _unitOfWork.SaveChangesAsync();

                    //Commit transaction
                    await _unitOfWork.CommitTransactionAsync();
                    return await GetProductByIdAsync(product.Id);
                }
                catch (Exception ex)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }
            }
        }

        /// <summary>
        /// Update a product async
        /// </summary>
        /// <param name="id"></param>
        /// <param name="productDTO"></param>
        /// <param name="productImageDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ProductsVM> UpdateProductAsync(
            int id, 
            ProductDTO productDTO,
            ICollection<ProductVariantDTO> variantDTOs,
            ProductImageDTO imageDTOs)
        {
            //Check if product is exitst
            var existingProduct = await _productRP.GetAsync(id);
            if (existingProduct == null || existingProduct.Id != id)
            {
                throw new Exception("No data maching!");
            }

            var existingPI = await _productImageRP.GetICollectionAsync(pI => pI.ProductID == existingProduct.Id);
            var pathImageOld = existingPI.Select(pI => pI.Image);

            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    //STEP 1: Update Products
                    var product = _mapper.Map<Product>(productDTO);
                    product.Id = existingProduct.Id;
                    product.Slug = existingProduct.Slug;
                    await _productRP.UpdateAsync(product.Id, product);
                    await _unitOfWork.SaveChangesAsync();

                    //STEP 2: Update ProductStatus
                    await _productExpansionsService.UpdateProductStatusAsync(product.Id);

                    //STEP 3: Update ProductVariant
                    await _productExpansionsService.UpdateProductVariantsAsync(product, variantDTOs);

                    //STEP 4: Update ProductImage
                    await _productExpansionsService.UpdateProductImageAsync(product.Id, imageDTOs);

                    //STEP 5: Commit Transaction
                    await _unitOfWork.CommitTransactionAsync();

                }
                catch (Exception ex)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }
            }
            var newProduct = await GetProductByIdAsync(existingProduct.Id);
            return newProduct;
        }

        /// <summary>
        /// Delete a product by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ProductsVM> DeleteProductAsync(int id)
        {
            var existingProduct = await _productRP.GetAsync(id);

            //Include data
            existingProduct = await _productRP.IncludeEntity(id, c => c.Category, c => c.Supplier, p => p.ProductStatus);

            if (existingProduct != null && !existingProduct.ProductStatus.Any(pS => pS.Name == Name.Deleted))
            {
                var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

                var productStatus = new ProductStatus()
                {
                    Name = Name.Deleted,
                    ProductID = existingProduct.Id,
                    UserID = userId,
                };

                //Update database
                await _productStatusRP.CreateAsync(productStatus);
                await _unitOfWork.SaveChangesAsync();

                return _mapper.Map<ProductsVM>(existingProduct);
            }
            return null;
        }

        /// <summary>
        /// Delete a range of product by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ICollection<ProductsVM>> DeleteProductsRangeAsync(List<int> idsToDelete)
        {
            Expression<Func<Product, bool>> filter = product => idsToDelete.Contains(product.Id);
            var productsToDelete = await _productRP.GetICollectionAsync(filter);
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            foreach (var product in productsToDelete)
            {
                var productStatus = new ProductStatus()
                {
                    Name = Name.Deleted,
                    ProductID = product.Id,
                    UserID = userId,
                };
                await _productStatusRP.CreateAsync(productStatus);
                await _unitOfWork.SaveChangesAsync();
            }
            return _mapper.Map<ICollection<ProductsVM>>(productsToDelete);
        }

        /// <summary>
        /// Permanently delete a product async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<ProductsVM> PermanentlyProductDeleted(int productId)
        {
            var existingProduct = await _productRP.GetAsync(productId);
            existingProduct = await _productRP.IncludeEntity(existingProduct.Id, p => p.ProductStatus);
            if (existingProduct == null || !existingProduct.ProductStatus.Any(pS => pS.Name == Name.Deleted))
            {
                return null;
            }
            else
            {
                using (var transaction = await _unitOfWork.BeginTransactionAsync())
                {
                    try
                    {
                        var images = (await _productImageRP.GetICollectionAsync(pI => pI.ProductID == existingProduct.Id))
                                                           .Select(pI => pI.Image)
                                                           .ToList();

                        //Update database
                        await _productExpansionsService.DeleteVariantsByProductIdAsync(existingProduct.Id);
                        await _productRP.DeleteAsync(existingProduct.Id);
                        await _unitOfWork.SaveChangesAsync();
                        await _unitOfWork.CommitTransactionAsync();
                        //Delete file Image
                        await _helpersService.DeleteCollectionImagesAsync(images);
                    }
                    catch (Exception ex)
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        throw new Exception(ex.Message);
                    }
                }
                return _mapper.Map<ProductsVM>(existingProduct);
            }
        }

        /// <summary>
        /// Restore a product async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ProductsVM> RestoreProductAsync(int id)
        {
            var productInTrash = await _productRP.GetAsync(id);
                productInTrash = await _productRP.IncludeEntity(id, c => c.Category, c => c.Supplier, p => p.ProductStatus);

            if (productInTrash != null && productInTrash.ProductStatus.Any(pS => pS.Name == Name.Deleted))
            {
                //Update database
                var productWillRestore = productInTrash.ProductStatus.SingleOrDefault(pS => pS.Name == Name.Deleted);
                await _productStatusRP.DeleteAsync(productWillRestore.Id);
                await _unitOfWork.SaveChangesAsync();

                return _mapper.Map<ProductsVM>(productInTrash);
            }
            return null;
        }

        /// <summary>
        /// Retore a range of product by expression lambda async
        /// </summary>
        /// <param name="idsToRestore"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ICollection<ProductsVM>> RetoreRangeProductsAsync(List<int> idsToRestore)
        {
            Expression<Func<Product, bool>> filter = product => idsToRestore.Contains(product.Id);
            Expression<Func<ProductStatus, bool>> filterPStatus = pS => idsToRestore.Contains(pS.ProductID) && pS.Name == Name.Deleted;

            var productsToRetore = await _productRP.GetICollectionAsync(filter);
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

            await _productStatusRP.DeleteRangeAsync(filterPStatus);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ICollection<ProductsVM>>(productsToRetore);
        }

    }
}
