using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API_Server.API.SignalRHubs
{
    [Authorize]
    public class OrdersHub : Hub
    {
        private IOrdersService _ordersService;

        public OrdersHub(IOrdersService ordersService) {
            _ordersService = ordersService;
        }

        public async Task<IActionResult> GetByToken()
        {
            try
            {
                var userId = Context.User?.FindFirst("UserID")?.Value ?? throw new Exception("Invalid user!");
                var result = await _ordersService.GetOrderByUserIdAsync(userId);
                if (result != null)
                {
                    await Clients.Caller.SendAsync("ReceiveOrders", result);
                    return new OkResult();
                }
                return new NotFoundResult();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetByToken: {ex.Message}");
                throw;
            }

        }

        [Authorize(Roles = $"{UserRole.Admin}, {UserRole.StoreManager}")]
        public async Task<IActionResult> GetAllByToken()
        {
            try
            {
                var result = await _ordersService.GetAllOrderAsync();
                if (result != null)
                {
                    await Clients.Caller.SendAsync("ReceiveAllOrders", result);
                    return new OkResult();
                }
                return new NotFoundResult();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetByToken: {ex.Message}");
                throw;
            }

        }
    }
}
