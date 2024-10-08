using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.Helpers;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace API_Server.Application.Services
{
    public class ProductExpansionsService : IProductExpansionsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHelpersService _helpersService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Product> _productRP;
        private readonly IGenericRepository<ProductColor> _productColorRP;
        private readonly IGenericRepository<ProductImage> _productImageRP;
        private readonly IGenericRepository<ProductOption> _productOptionRP;
        private readonly IGenericRepository<ProductOptionType> _productOptionTypeRP;
        private readonly IGenericRepository<ProductStatus> _productStatusRP;
        private readonly IGenericRepository<ProductVariant> _productVariantRP;
        private readonly IGenericRepository<Category> _categoryRP;
        private readonly IGenericRepository<Supplier> _supplierRP;

        public ProductExpansionsService(IUnitOfWork unitOfWork, IHelpersService helpersService, IMapper mapper,
            IHttpContextAccessor httpContextAccessor)
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
            _helpersService = helpersService;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        /// <summary>
        /// Get a product variant by Id async
        /// </summary>
        /// <param name="productVariantId"></param>
        /// <returns></returns>
        public async Task<ProductVariant> GetProductVariantByIdAsync(int productVariantId)
        {
            var productVariant = await _productVariantRP.GetAsync(productVariantId);
            productVariant = await _productVariantRP.IncludeEntity(productVariant.Id,
                                                                   pV => pV.ProductOption.ProductOptionType,
                                                                   pV => pV.ProductOption.Product,
                                                                   pV => pV.ProductColor,
                                                                   pV => pV.ProductImage);

            return productVariant;
        }

        /// <summary>
        /// Get product variants by collection Id async
        /// </summary>
        /// <param name="productVariantId"></param>
        /// <returns></returns>
        public async Task<ICollection<ProductVariant>> GetProductVariantByIdAsync(ICollection<int> productVariantId)
        {
            var productVariants = await _productVariantRP.GetICollectionAsync(pV => productVariantId.Contains(pV.Id));
            if (productVariants.Count == 0 )
            {
                throw new Exception("No data maching!");
            }    
           
            productVariants = await _productVariantRP.IncludeEntities(productVariants.Select(pV => (object)pV.Id),
                                                                      pV => pV.ProductOption.ProductOptionType,
                                                                      pV => pV.ProductOption.Product,
                                                                      pV => pV.ProductColor,
                                                                      pV => pV.ProductImage);

            return productVariants;
        }

        /// <summary>
        /// Get variants by product id async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async Task<ICollection<ProductVariant>> GetVariantsByProductIdAsync(int productId)
        {
            var productOptions = await _productOptionRP.GetICollectionAsync(pO => pO.ProductID == productId);
            var ids = productOptions.Select(p => p.Id);
            var productVariants = await _productVariantRP.GetICollectionAsync(pV => ids.Contains(pV.ProductOptionID));
            productVariants = await _productVariantRP.IncludeEntities(productVariants.Select(pV => (object)pV.Id),
                                                                      pV => pV.ProductOption.ProductOptionType,
                                                                      pV => pV.ProductColor,
                                                                      pV => pV.ProductImage);
            return productVariants;
        }

        /// <summary>
        /// Get variants by ProductOptionID async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async Task<ICollection<ProductVariantDetailVM>> GetVariantsByProductOptionIdAsync(int productOptionId)
        {
            var productVariants = await _productVariantRP.GetICollectionAsync(pV => pV.ProductOptionID == productOptionId);
            productVariants = await _productVariantRP.IncludeEntities(productVariants.Select(pV => (object)pV.Id),
                                                                      pV => pV.ProductOption.ProductOptionType,
                                                                      pV => pV.ProductColor,
                                                                      pV => pV.ProductImage);
            var productVariantsVM = _mapper.Map<ICollection<ProductVariantDetailVM>>(productVariants);
            return productVariantsVM;
        }


        /// <summary>
        /// Create a new option if the option doesn't exst, if it exists do nothing (Async)
        /// </summary>
        /// <param name="option"></param>
        /// <returns></returns>
        public async Task<ProductOptionType> CreateProductOptionAsync(string option)
        {
            if (!string.IsNullOrEmpty(option))
            {
                var existingOptionType = await _productOptionTypeRP.GetAsync(pOT => option.ToUpper() == pOT.Option.ToUpper());
                if (existingOptionType == null)
                {
                    var optionType = new ProductOptionType()
                    {
                        Option = _helpersService.CapitalizeTheFirst(option),
                        SKU = _helpersService.GetInitialsUppercase(option),
                    };

                    //Create ProductOption and update database
                    await _productOptionTypeRP.CreateAsync(optionType);
                    await _unitOfWork.SaveChangesAsync();
                    return optionType;
                }
                return existingOptionType;
            }
            return null;
        }

        /// <summary>
        /// Create a new color if the color doesn't exst, if it exists do nothing (Async)
        /// </summary>
        /// <param name="color"></param>
        /// <returns></returns>
        public async Task<ProductColor> CreateProductColorAsync(string color)
        {
            if (!string.IsNullOrEmpty(color))
            {
                var existingColor = await _productColorRP.GetAsync(pOT => color.ToUpper() == pOT.Color.ToUpper());
                if (existingColor == null)
                {
                    var productColor = new ProductColor()
                    {
                        Color = _helpersService.CapitalizeTheFirst(color),
                        SKU = _helpersService.GetInitialsUppercase(color),
                    };

                    //Create ProductColor and update database
                    await _productColorRP.CreateAsync(productColor);
                    await _unitOfWork.SaveChangesAsync();
                    return productColor;
                }
                return existingColor;
            }
            return null;
        }


        /// <summary>
        /// Create or Update ProductVariants async
        /// </summary>
        /// <param name="variantDTOs"></param>
        /// <param name="product"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task CreateProductVariantsAsync(Product product, ICollection<ProductVariantDTO> variantDTOs)
        {
            foreach (var variantDTO in variantDTOs)
            {
                //Genereate SKU for Product variant
                var categoy = await _categoryRP.GetAsync(product.CategoryID);
                var supplier = await _supplierRP.GetAsync(product.SupplierID);
                string convertCategoy = _helpersService.GetInitialsUppercase((categoy != null ? categoy.Name : "Không có danh mục"));
                string convertSupplier = _helpersService.GetInitialsUppercase((supplier != null ? supplier.Name : "Không có nhà sản xuất"));
                string pvSKU = $"{convertCategoy}-{convertSupplier}-";

                //=====STEP 1: Create ProductOptionType=====
                var productOption = new ProductOption();
                productOption.ProductID = product.Id;

                //Check if the Product has options
                if (!string.IsNullOrEmpty(variantDTO.Option))
                {
                    var optionType = await CreateProductOptionAsync(variantDTO.Option);
                    productOption.ProductOptionTypeID = optionType.Id;
                    //SKU for Product variant
                    pvSKU += optionType.SKU;
                }
                var checkProductOption = await _productOptionRP.GetICollectionAsync(pO => pO.ProductID == product.Id);

                //=====STEP 2: Create ProductOption=====
                if (!checkProductOption.Any(pO => pO.ProductOptionTypeID == productOption.ProductOptionTypeID))
                {
                    await _productOptionRP.CreateAsync(productOption);
                    await _unitOfWork.SaveChangesAsync();
                }
                else
                {
                    productOption.Id = checkProductOption.FirstOrDefault(pO => pO.ProductOptionTypeID == productOption.ProductOptionTypeID).Id;
                }

                //=====STEP 3: Create ProductColor=====
                var productColor = await CreateProductColorAsync(variantDTO.Color);
                pvSKU += productColor.SKU;

                //=====STEP 4: Create ProductImage for ProductVariant=====
                string fileName = $"{product.Slug}-{Guid.NewGuid()}";
                string path = _helpersService.GetImageName(variantDTO.ThumbFile, "products", fileName)
                                ?? throw new Exception("The uploaded file is not a valid image.");
                var productImage = new ProductImage()
                {
                    Image = path,
                    ProductID = product.Id,
                    IsThumbnail = true,
                };
                await _helpersService.UploadImageAsync(variantDTO.ThumbFile, path);
                await _productImageRP.CreateAsync(productImage);
                await _unitOfWork.SaveChangesAsync();

                //=====STEP 5: Create ProductVariant=====
                var productVariants = _mapper.Map<ProductVariant>(variantDTO);
                object lastID = await _productVariantRP.GetLastIdAsync() ?? 1;
                productVariants.SKU = $"{pvSKU}{lastID}";
                productVariants.ProductImageID = productImage.Id;
                productVariants.ProductOptionID = productOption.Id;
                productVariants.ProductColorID = productColor.Id;
                await _productVariantRP.CreateAsync(productVariants);
                await _unitOfWork.SaveChangesAsync();
            }
            var checkDefault = await _productVariantRP.GetICollectionAsync(pV => pV.ProductOption.ProductID == product.Id && pV.IsDefault == true);
            if (checkDefault.Count == 0)
            {
                throw new Exception("The Product has no default display product variations!");
            }
            if (checkDefault.Count > 1)
            {
                throw new Exception("The product has many default display product variations!");
            }
        }

        /// <summary>
        /// Create related product images async
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="productImageDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task CreateProductImageAsync(int productId, ProductImageDTO productImageDTO)
        {
            var existingProduct = await _productRP.GetAsync(productId) ?? throw new Exception("No product maching!");
            var paths = new List<string>();
            var newProductImages = new List<ProductImage>();
            foreach (var fileImage in productImageDTO.ImageFile)
            {
                var path = _helpersService.GetImageName(fileImage, "products", $"{existingProduct.Slug}-description-{Guid.NewGuid()}");
                paths.Add(path);

                var newProductImage = new ProductImage
                {
                    ProductID = productId,
                    Image = path,
                };
                newProductImages.Add(newProductImage);
            }
            await _helpersService.UploadCollectionImagesAsync(productImageDTO.ImageFile, paths);
            await _productImageRP.CreateRangeAsync(newProductImages);
            await _unitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Update ProductVariants async
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="productImageDTO"></param>
        /// <returns></returns>
        public async Task UpdateProductImageAsync(int productId, ProductImageDTO productImageDTO)
        {
            //Get existingProduct and existingProductImages
            var existingProduct = await _productRP.GetAsync(productId) ?? throw new Exception("No product maching!");
            var existingProductImages = await _productImageRP.GetICollectionAsync(pI => pI.ProductID == existingProduct.Id);

            //Create a list of image names
            var newImages = new List<string>();
            newImages.AddRange(existingProductImages.Where(pI => pI.IsThumbnail == true).Select(pI => pI.Image));
            if (productImageDTO.ImageUrl != null)
            {
                newImages.AddRange(productImageDTO.ImageUrl);
            }

            //Create a list of path image
            var paths = new List<string>();

            //Create a list of ProductImages entities
            var newProductImages = new List<ProductImage>();

            if (productImageDTO.ImageFile != null)
            {
                //Add images to the path "wwwroot/images/products/"
                foreach (var fileImage in productImageDTO.ImageFile)
                {
                    var path = _helpersService.GetImageName(fileImage, "products", $"{existingProduct.Slug}-description-{Guid.NewGuid()}");
                    paths.Add(path);

                    var newProductImage = new ProductImage
                    {
                        ProductID = productId,
                        Image = path,
                    };
                    newProductImages.Add(newProductImage);
                    newImages.Add(path);
                }
                await _helpersService.UploadCollectionImagesAsync(productImageDTO.ImageFile, paths);
            }

            await _productImageRP.CreateRangeAsync(newProductImages);
            await _unitOfWork.SaveChangesAsync();

            //Delete obsolete image
            foreach (var image in existingProductImages)
            {
                if (!newImages.Any(i => i == image.Image))
                {
                    await _productImageRP.DeleteAsync(image.Id);
                    await _unitOfWork.SaveChangesAsync();
                    await _helpersService.DeleteImageAsync(image.Image);
                }    
            } 
        }

        /// <summary>
        /// Update produc status by product id async
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async Task UpdateProductStatusAsync(int productId) 
        {
            var userID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var productStatusIsDelete = await _productStatusRP.GetAsync(pS => pS.ProductID == productId && pS.Name == Name.Deleted);
            if(productStatusIsDelete != null)
            {
                throw new Exception("Deleted products cannot be updated!");
            }    

            var productStatus = await _productStatusRP.GetAsync(pS => pS.ProductID == productId && pS.Name == Name.Updated);
            if (productStatus != null)
            {
                productStatus.Date = DateTime.UtcNow;
                await _productStatusRP.UpdateAsync(productStatus.Id, productStatus);
            }
            else
            {
                var newPS = new ProductStatus()
                {
                    Name = Name.Updated,
                    ProductID = productId,
                    UserID = userID,
                };
                await _productStatusRP.CreateAsync(newPS);
            }
            await _unitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Update ProductVariants async
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="variantDTOs"></param>
        /// <param name="product"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task UpdateProductVariantsAsync(Product product, ICollection<ProductVariantDTO> variantDTOs)
        {
            //Get ProductOptions
            var existingOptions = await _productOptionRP.GetICollectionAsync(pO => pO.ProductID == product.Id);
            var idPOs = existingOptions.Select(pO => pO.Id);
            //Get ProductVariants
            var existingVariants = await _productVariantRP.GetICollectionAsync(pV => idPOs.Contains(pV.ProductOptionID));
            existingVariants = await _productVariantRP.IncludeEntities(existingVariants.Select(pV => (Object)pV.Id),
                                                                        pV => pV.ProductColor,
                                                                        pV => pV.ProductOption,
                                                                        pV => pV.ProductOption.ProductOptionType);
            var existingVariantMap = existingVariants.ToDictionary(
                v => $"{v.ProductOption.ProductOptionType.Option.ToUpper()}|{v.ProductColor.Color.ToUpper()}",
                v => v.Id);

            var newVariants = new List<ProductVariantDTO>();

            //STEP 1: Update product variants
            foreach (var variantDTO in variantDTOs)
            {
                var key = $"{variantDTO.Option.ToUpper()}|{variantDTO.Color.ToUpper()}";

                if (existingVariantMap.TryGetValue(key, out var variantId))
                {
                    //Map data
                    var variant = _mapper.Map<ProductVariant>(variantDTO);
                    variant.Id = variantId;
                    var existingVariant = existingVariants.SingleOrDefault(pV => pV.Id == variantId);
                    variant.SKU = existingVariant.SKU;
                    variant.ProductOptionID = existingVariant.ProductOptionID;
                    variant.ProductColorID = existingVariant.ProductColorID;
                    variant.ProductImageID = existingVariant.ProductImageID;

                    if(!string.IsNullOrEmpty(variantDTO.ThumbUrl))
                    {
                        string existingImageName = (await _productImageRP.GetAsync(variant.ProductImageID)).Image;
                        if(variantDTO.ThumbUrl != existingImageName || variantDTO.ThumbFile != null)
                        {
                            throw new Exception("Invalid image!");
                        }
                    }   

                    //Check if ThumbUrl doesn't exist, then add image to the ProductImage and delete the image that exist
                    if (string.IsNullOrEmpty(variantDTO.ThumbUrl) && variantDTO.ThumbFile != null)
                    {
                        string fileName = $"{product.Slug}-{Guid.NewGuid()}";
                        string path = _helpersService.GetImageName(variantDTO.ThumbFile, "products", fileName)
                                        ?? throw new Exception("The uploaded file is not a valid image.");

                        var existingPI= await _productImageRP.GetAsync(existingVariant.ProductImageID);
                        string obsolateImage = existingPI.Image;
                        existingPI.Image = path;

                        await _productImageRP.UpdateAsync(existingPI.Id, existingPI);
                        await _unitOfWork.SaveChangesAsync();
                        await _helpersService.DeleteImageAsync(obsolateImage);
                        await _helpersService.UploadImageAsync(variantDTO.ThumbFile, path);
                    }

                    //Update data to the database
                    await _productVariantRP.UpdateAsync(variantId, variant);
                    await _unitOfWork.SaveChangesAsync();
                }
                else
                {
                    newVariants.Add(variantDTO);
                }
            }

            //STEP 2: Create product variants if it doesn't exist
            await CreateProductVariantsAsync(product, newVariants);

            //STEP 3: Delete obsolete product variants
            foreach (var existingVariant in existingVariants)
            {
                if (!variantDTOs.Any(v =>
                    v.Option.ToUpper() == existingVariant.ProductOption.ProductOptionType.Option.ToUpper() &&
                    v.Color.ToUpper() == existingVariant.ProductColor.Color.ToUpper()))
                {
                    await _productVariantRP.DeleteAsync(existingVariant.Id);
                }
            }
            await _unitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Delete product variants by ProductID collection async
        /// </summary>
        /// <param name="productIds"></param>
        /// <returns></returns>
        public async Task DeleteVariantsByProductIdAsync(int productIds)
        {
            Expression<Func<ProductVariant, bool>> filter = productVatiant => productVatiant.ProductOption.ProductID == productIds;
            await _productVariantRP.DeleteRangeAsync(filter);
            await _unitOfWork.SaveChangesAsync();
        }

    }
}
