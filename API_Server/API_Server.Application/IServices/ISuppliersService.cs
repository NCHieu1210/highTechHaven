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
    public interface ISuppliersService
    {
        /// <summary>
        /// Get All Suppliers
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<SupplierVM>> GetAllAsync();

        /// <summary>
        /// Get an Supplier by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<SupplierVM> GetByIdAsync(int id);

        /// <summary>
        /// Get an Supplier by slug
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<SupplierVM> GetBySlugAsync(string slug);


        /// <summary>
        /// Create a Supplier
        /// </summary>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public Task<SupplierVM> CreateAsync(SupplierDTO supplierDTO);

        /// <summary>
        /// Update an Supplier 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="fileImage"></param>
        /// <returns></returns>
        public Task<SupplierVM> UpdateAsync(int id, SupplierDTO supplierDTO);

        /// <summary>
        /// Delete an Supplier
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<SupplierVM> DeleteAsync(int id);

        /// <summary>
        /// Delete a range of supplier by expression lambda async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<ICollection<SupplierVM>> DeleteRangeAsync(List<int> idsToDelete);

    }
}
