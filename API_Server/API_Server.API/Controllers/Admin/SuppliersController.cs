using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Entities;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Server.API.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class SuppliersController : BaseController
    {
        private readonly ISuppliersService _supplierServices;

        /// <summary>
        /// Dependency Injection ISuppliersService and IMapper
        /// </summary>
        /// <param name="supplierServices"></param>
        /// <param name="mapper"></param>
        public SuppliersController(ISuppliersService supplierServices)
        {
            _supplierServices = supplierServices;
        }

        /// <summary>
        /// Create an supplier
        /// </summary>
        /// <param name="supplierDTO"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> CreateAsync([FromForm] SupplierDTO supplierDTO)
        {
            return await HandleCreateRequestAsync(() => _supplierServices.CreateAsync(supplierDTO), result => result != null);
        }

        /// <summary>
        /// Update an supplier
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Marketing}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromForm] SupplierDTO supplierDTO)
        {
            return await HandleDeleteRequestAsync(() => _supplierServices.UpdateAsync(id, supplierDTO), result => result != null);
        }

        /// <summary>
        /// Delete an supplier
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            return await HandleDeleteRequestAsync(() => _supplierServices.DeleteAsync(id), result => result != null);
        }

        /// <summary>
        /// Delete a range suppliers by lamda expresssion lambda
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("delete-range")]
        [Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteRangeAsync(List<int> idsToDelete)
        {
            return await HandleDeleteRequestAsync(() => _supplierServices.DeleteRangeAsync(idsToDelete), result => result != null);
        }
    }
}
