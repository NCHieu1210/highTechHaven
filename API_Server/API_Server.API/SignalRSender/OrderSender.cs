using API_Server.API.SignalRHubs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.ISender;
using API_Server.Domain.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API_Server.API.SignalRSender
{
    public class OrderSender : IOrderSender
    {
        private readonly IHubContext<OrdersHub> _hubContext;

        public OrderSender(IHubContext<OrdersHub> hubContext) {
            _hubContext = hubContext;
        }

        /// <summary>
        /// Send all order by userId async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="orders"></param>
        /// <returns></returns>
        public async Task SendAllOrderByUserId(string userId, ICollection<OrderVM> orders)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveOrders", orders);
        }

        /// <summary>
        ///  Send all order by collection userId async
        /// </summary>
        /// <param name="userIds"></param>
        /// <param name="orders"></param>
        /// <returns></returns>
        public async Task SendAllOrderByUserId(ICollection<string> userIds, ICollection<OrderVM> orders)
        {
            await _hubContext.Clients.Users(userIds).SendAsync("ReceiveAllOrders", orders);
        } 

    }
}
