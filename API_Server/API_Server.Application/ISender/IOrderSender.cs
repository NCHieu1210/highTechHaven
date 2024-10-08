using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.ISender
{
    public interface IOrderSender
    {
        /// <summary>
        /// Send all order by userId async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="orders"></param>
        /// <returns></returns>
        public Task SendAllOrderByUserId(string userId, ICollection<OrderVM> orders);
        public Task SendAllOrderByUserId(ICollection<string> userIds, ICollection<OrderVM> orders);
    }
}
