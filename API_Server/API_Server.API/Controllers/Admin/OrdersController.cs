using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class OrdersController : BaseController
    {
        private readonly IOrdersService _ordersService;
        private readonly IOrderUpdatesService _orderUpdatesService;

        public OrdersController(IOrdersService ordersService, IOrderUpdatesService orderUpdatesService)
        {
            _ordersService = ordersService;
            _orderUpdatesService = orderUpdatesService;
        }

        [HttpGet()]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.StoreManager}")]
        public async Task<IActionResult> GetAllOrders()
        {
            return await HandleGetRequestAsync(() => _ordersService.GetAllOrderAsync(), result => result != null);
        }


        /// <summary>
        /// Change order status
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        [HttpPost("{orderId}/change-status")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.StoreManager}")]
        public async Task<IActionResult> ChangeOrderStatus(int orderId)
        {
            return await HandleCreateRequestAsync(() => _orderUpdatesService.ChangeOrderStatusAsync(orderId), result => result != null);
        }

        /// <summary>
        /// Cancel order
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        [HttpPost("{orderId}/cancel")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.StoreManager} , {UserRole.Customer}")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            return await HandleCreateRequestAsync(() => _orderUpdatesService.CancelOrderAsync(orderId), result => result != null);
        }

        /// <summary>
        /// Get gevenue async
        /// </summary>
        /// <returns></returns>
        [HttpGet("revenue")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.StoreManager}")]
        public async Task<IActionResult> GetRevenue()
        {
            return await HandleGetRequestAsync(() => _ordersService.GetRevenueAsync(), result => result != null);
        }
    }
}
