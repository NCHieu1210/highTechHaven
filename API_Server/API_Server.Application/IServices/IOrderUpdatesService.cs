using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IOrderUpdatesService
    {
        /// <summary>
        ///  Change order status async
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        public Task<OrderUpdateVM> ChangeOrderStatusAsync(int orderId);

        /// <summary>
        /// Cancel order async
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        public Task<OrderUpdateVM> CancelOrderAsync(int orderId);
    }
}
