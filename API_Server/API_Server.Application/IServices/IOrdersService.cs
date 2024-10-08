using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IOrdersService
    {
        /// <summary>
        /// Create order async
        /// </summary>
        /// <param name="orderDTO"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<OrderVM> CreateOrderAsync(OrderDTO orderDTO);

        /// <summary>
        /// Get All orders async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<OrderVM>> GetAllOrderAsync();

        /// <summary>
        /// Get order by token async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<OrderVM>> GetOrderByTokenAsync();

        /// <summary>
        /// Get order by user id async
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<ICollection<OrderVM>> GetOrderByUserIdAsync(string userId);


        /// <summary>
        /// Get  orders history by token async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<OrderVM>> GetOrderHistoryByTokenAsync();

        /// <summary>
        /// Create payment url
        /// </summary>
        /// <param name="context"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public string CreatePaymentUrl(HttpContext context, VnPayRequiredModel model);

        /// <summary>
        /// Payment excute
        /// </summary>
        /// <param name="collections"></param>
        /// <returns></returns>
        public VnPaymentResponseModel PaymentExcute(IDictionary<string, string> collections);

        /// <summary>
        /// Get gevenue async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<RevenueVM>> GetRevenueAsync();
    }
}
