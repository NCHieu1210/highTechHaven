using API_Server.Application.IServices;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Infastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using API_Server.Domain;
using Microsoft.IdentityModel.Tokens;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.API.Controllers.Base;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
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
        /// Get All Suppliers
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            return await HandleGetRequestAsync(() => _supplierServices.GetAllAsync(), result => result != null);
        }

        /// <summary>
        /// Get an Supplier by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            return await HandleGetRequestAsync(() => _supplierServices.GetByIdAsync(id), result => result != null); 
        }

        /// <summary>
        /// Get an Supplier by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlugAsync(string slug)
        {
            return await HandleGetRequestAsync(() => _supplierServices.GetBySlugAsync(slug), result => result != null);
        }
    }
}
