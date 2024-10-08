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
using System.IO;

namespace API_Server.Application.Services
{
    public class SuppliersService : ISuppliersService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Supplier> _suppliersRP;
        private readonly IGenericRepository<Product> _productRP;
        private readonly IHelpersService _helpersService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Injection IUnitOfWork and IUploadFileService
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="uploadFile"></param>
        public SuppliersService(IUnitOfWork unitOfWork, IHelpersService helpersService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _suppliersRP = unitOfWork.RepositorySuppliers;
            _productRP = _unitOfWork.RepositoryProducts;
            _helpersService = helpersService;
            _mapper = mapper;
        }

        /// <summary>
        /// Get All Suppliers async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<SupplierVM>> GetAllAsync()
        {
            var suppliers = await _suppliersRP.GetAsync();
            var suppliersVM = _mapper.Map<ICollection<SupplierVM>>(suppliers);
            var includeSuppliers = new List<Supplier>();
            foreach (var supplierVM in suppliersVM)
            {
                var includeSupplier = await _suppliersRP.IncludeEntity(supplierVM.Id, supplier => supplier.Products);
                includeSuppliers.Add(includeSupplier);
                supplierVM.QuantityProducts = includeSupplier.Products.Count;
            }
            return suppliersVM;
        }

        /// <summary>
        /// Get an Supplier by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<SupplierVM> GetByIdAsync(int id)
        {
            var supplier = await _suppliersRP.GetAsync(id);
            var includeSupplier = await _suppliersRP.IncludeEntity(supplier.Id, s => s.Products);
            var supplierVM = _mapper.Map<SupplierVM>(supplier);
            supplierVM.QuantityProducts = includeSupplier.Products.Count;
            return supplierVM;
        }

        /// <summary>
        /// Get an Supplier by slug async
        /// </summary>
        /// <param name="slug"></param>
        /// <returns></returns>
        public async Task<SupplierVM> GetBySlugAsync(string slug)
        {
            var supplier = await _suppliersRP.GetAsync(s => s.Slug == slug);
            var includeSupplier = await _suppliersRP.IncludeEntity(supplier.Id, s => s.Products);
            var supplierVM = _mapper.Map<SupplierVM>(supplier);
            supplierVM.QuantityProducts = includeSupplier.Products.Count;
            return supplierVM;
        }

        /// <summary>
        /// Create an Supplier async
        /// </summary>
        /// <param name="supplier"></param>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public async Task<SupplierVM> CreateAsync(SupplierDTO supplierDTO)
        {
            var supplier = _mapper.Map<Supplier>(supplierDTO);
            supplier.Slug = _helpersService.GenerateSlug(supplier.Name);

            //Upload Image
            string path = _helpersService.GetImageName(supplierDTO.FileLogo, "suppliers", supplier.Slug) ?? throw new Exception("The uploaded file is not a valid image.");
            supplier.Logo = path;

            //Update database
            await _suppliersRP.CreateAsync(supplier);
            await _unitOfWork.SaveChangesAsync();

            //Upload file image
            await _helpersService.UploadImageAsync(supplierDTO.FileLogo, path);

            return _mapper.Map<SupplierVM>(supplier);
        }

        /// <summary> 
        ///  Update an Supplier async
        /// </summary>
        /// <param name="id"></param>
        /// <param name="supplier"></param>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public async Task<SupplierVM> UpdateAsync(int id, SupplierDTO supplierDTO)
        {
            if (!string.IsNullOrEmpty(supplierDTO.UrlLogo) && supplierDTO.FileLogo != null)
            {
                throw new Exception("Input data is incorrect!");
            }   
            //Check if supplier is exitst
            var existingSupplier = await _suppliersRP.GetAsync(id);
            if (existingSupplier == null || existingSupplier.Id != id)
            {
                throw new Exception("No data maching!");
            }
            string pathImageOld = existingSupplier.Logo;

            var supplier = _mapper.Map<Supplier>(supplierDTO);
            supplier.Slug = _helpersService.GenerateSlug(supplierDTO.Name);
            supplier.Id = id;

            //Check if url logo is null or empty
            if(string.IsNullOrEmpty(supplierDTO.UrlLogo))
            {
                string path = _helpersService.GetImageName(supplierDTO.FileLogo, "suppliers", supplier.Slug) ?? throw new Exception("The uploaded file is not a valid image.");
                supplier.Logo = path;
            }
            else
            {
                string pathExtension = _helpersService.GetFileExtension(supplierDTO.UrlLogo);
                supplier.Logo = $"/images/suppliers/{supplier.Slug}{pathExtension}"; ;
            }

            //Update database
            await _suppliersRP.UpdateAsync(id, supplier);
            await _unitOfWork.SaveChangesAsync();

            //Delete file image old and upload file image new
            //Check if url logo is null or empty
            if (string.IsNullOrEmpty(supplierDTO.UrlLogo) && supplierDTO.FileLogo != null)
            {
                if (!string.IsNullOrEmpty(pathImageOld))
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
                await _helpersService.UploadImageAsync(supplierDTO.FileLogo, supplier.Logo);
            }
            //Check if url logo is'nt null or empty
            else if (!string.IsNullOrEmpty(supplierDTO.UrlLogo) && supplierDTO.FileLogo == null)
            {
                await _helpersService.RenameImageAsync(supplierDTO.UrlLogo, supplier.Logo);
            }    
            else
            {
                if (!string.IsNullOrEmpty(pathImageOld))
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
            }    

            return _mapper.Map<SupplierVM>(supplier);
        }

        /// <summary>
        /// Delete a Supplier async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<SupplierVM> DeleteAsync(int id)
        {
            //Find a supplier by id
            var existingSupplier = await _suppliersRP.GetAsync(id);
            if (existingSupplier == null)
            {
                return null;
            }
            else
            {
                //Update database
                await _suppliersRP.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                //Delete file logo
                if(!string.IsNullOrEmpty(existingSupplier.Logo))
                {
                    await _helpersService.DeleteImageAsync(existingSupplier.Logo);
                }    

                return _mapper.Map<SupplierVM>(existingSupplier); ;
            }    
        }

        /// <summary>
        /// Delete a range of supplier by expression lambda async
        /// </summary>
        /// <param name="idsToDelete"></param>
        /// <returns></returns>
        public async Task<ICollection<SupplierVM>> DeleteRangeAsync(List<int> idsToDelete)
        {
            Expression<Func<Supplier, bool>> filter = supplier => idsToDelete.Contains(supplier.Id);

            var suppliersToDelete = await _suppliersRP.GetICollectionAsync(filter);

            if (suppliersToDelete.Count != idsToDelete.Count)
            {
                return null;
            }   
                    
            await _suppliersRP.DeleteRangeAsync(filter);
            await _unitOfWork.SaveChangesAsync();

            foreach (var supplier in suppliersToDelete)
            {
                if (!string.IsNullOrEmpty(supplier.Logo))
                {
                    await _helpersService.DeleteImageAsync(supplier.Logo);
                }
            }

            return _mapper.Map<ICollection<SupplierVM>>(suppliersToDelete);
        }
    }
}
