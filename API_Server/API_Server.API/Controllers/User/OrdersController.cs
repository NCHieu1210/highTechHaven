using API_Server.API.Controllers.Base;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Server.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : BaseController
    {
        private readonly IOrdersService _ordersService;

        public OrdersController(IOrdersService ordersService) {
            _ordersService = ordersService;
        }

        /// <summary>
        /// Create order 
        /// </summary>
        /// <param name="orderDTO"></param>
        /// <returns></returns>
        [HttpPost("create")]
        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.Customer}")]
        public async Task<IActionResult> CreateOrder(OrderDTO orderDTO)
        {
            return await HandleCreateRequestAsync(() => _ordersService.CreateOrderAsync(orderDTO), result => result != null);
        }

        /// <summary>
        /// Get order by token
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetOrderByToken()
        {
            return await HandleGetRequestAsync(() => _ordersService.GetOrderByTokenAsync(), result => result != null);
        }

        /// <summary>
        /// Get order by token
        /// </summary>
        /// <returns></returns>
        [HttpGet("order-history")]
        [Authorize]
        public async Task<IActionResult> GetOrderHistoryByToken()
        {
            return await HandleGetRequestAsync(() => _ordersService.GetOrderHistoryByTokenAsync(), result => result != null);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpPost("payment-with-vnpay")]
        public IActionResult PamentWithVnPay(VnPayRequiredModel vnPayRequiredModel)
        {
            vnPayRequiredModel.SKU = new Random().Next(1000, 1000000).ToString();
            /*vnPayRequiredModel.SKU ="ADJDJKSADJMKSAJDKS";*/
            vnPayRequiredModel.CreateDate = DateTime.Now;
            vnPayRequiredModel.ExpireDate = DateTime.Now.AddMinutes(15);
            var paymentUrl = _ordersService.CreatePaymentUrl(HttpContext, vnPayRequiredModel);
            return Ok(paymentUrl);
        }
    
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet("payment-callback")]
        public IActionResult PaymentCallBack()
        {
            try
            {
                var query = Request.Query;
                var queryDictionary = query.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
                var reponse = _ordersService.PaymentExcute(queryDictionary);
                if (reponse == null || reponse.VnPayResponseCode != "00")
                {
                    return Redirect("https://hth-ecom.vercel.app/cart/check-out");

                }
                return Redirect("https://hth-ecom.vercel.app/orders/payment");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
