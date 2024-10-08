using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.IExternalServices;
using API_Server.Domain.Interfaces;
using API_Server.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using API_Server.Application.Helpers;
using API_Server.Application.ISender;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_Server.Application.Services
{
    public class OrdersService : IOrdersService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Order> _orderRP;
        private readonly IGenericRepository<OrderDetail> _orderDetailRP;
        private readonly IGenericRepository<OrderUpdate> _orderUpdateRP;
        private readonly IGenericRepository<Cart> _cartRP;
        private readonly IIncludeWithUser<Order> _includeWithUser;
        private readonly IGenericRepository<Product> _productPR;
        private readonly INotificationsService _notificationsService;
        private readonly IUsersRepository _userRP;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IVnPayService _vnPayService;
        private readonly IHelpersService _helpersService;
        private readonly IOrderSender _orderSender;

        public OrdersService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor, IVnPayService vnPayService,
            IUsersRepository usersRP, INotificationsService notificationsService, IHelpersService helpersService,
            IOrderSender orderSender)
        {
            _unitOfWork = unitOfWork;
            _orderRP = _unitOfWork.RepositoryOrders;
            _orderDetailRP = _unitOfWork.RepositoryOrderDetails;
            _orderUpdateRP = _unitOfWork.RepositoryOrderUpdates;
            _cartRP = _unitOfWork.RepositoryCarts;
            _includeWithUser = _unitOfWork.IncludeOrderWithUser;
            _productPR = _unitOfWork.RepositoryProducts;
            _notificationsService = notificationsService;
            _userRP = usersRP;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _vnPayService = vnPayService;
            _helpersService = helpersService;
            _orderSender = orderSender;
        }

        /// <summary>
        /// Get All orders async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<OrderVM>> GetAllOrderAsync()
        {
            var orders = await _orderRP.GetAsync();
            if (!orders.Any())
            {
                return new List<OrderVM>();
            }
            orders = await _orderRP.IncludeEntities(orders.Select(o => (object)o.Id), o => o.OrderDetails, o => o.OrderUpdates);
            var incldeOrders = new List<Order>();
            foreach (var order in orders)
            {
                var incldeOrder = await _includeWithUser.GetGenericWithUserAsync(order.Id);
                order.User = incldeOrder.User;
                incldeOrders.Add(order);
            }

            return _mapper.Map<ICollection<OrderVM>>(incldeOrders);
        }

        /// <summary>
        /// Get order by token async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<OrderVM>> GetOrderByTokenAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value ?? throw new Exception("Invalid User!"); ;
            var orders = await _orderRP.GetICollectionAsync(o => o.UserID == userId);
            if (!orders.Any())
            {
                return new List<OrderVM>();
            }
            orders = await _orderRP.IncludeEntities(orders.Select(o => (object)o.Id), o => o.OrderDetails, o => o.OrderUpdates);
            var incldeOrders = new List<Order>();
            foreach (var order in orders)
            {
                var incldeOrder = await _includeWithUser.GetGenericWithUserAsync(order.Id);
                order.User = incldeOrder.User;
                incldeOrders.Add(order);
            }

            return _mapper.Map<ICollection<OrderVM>>(incldeOrders);
        }


        /// <summary>
        /// Get order by user id async
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<ICollection<OrderVM>> GetOrderByUserIdAsync(string userId)
        {
            var orders = await _orderRP.GetICollectionAsync(o => o.UserID == userId);
            if (!orders.Any()) 
            {
                return new List<OrderVM>(); 
            }
            orders = await _orderRP.IncludeEntities(orders.Select(o => (object)o.Id), o => o.OrderDetails, o => o.OrderUpdates);
            var incldeOrders = new List<Order>();
            foreach (var order in orders)
            {
                var incldeOrder = await _includeWithUser.GetGenericWithUserAsync(order.Id);
                order.User = incldeOrder.User;
                incldeOrders.Add(order);
            }

            return _mapper.Map<ICollection<OrderVM>>(incldeOrders);
        }

        /// <summary>
        /// Get orders history by token async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<OrderVM>> GetOrderHistoryByTokenAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value ?? throw new Exception("Invalid User!");
            var orders = await _orderRP.GetICollectionAsync(o => (o.UserID == userId) &&
                                                                 (o.OrderUpdates.Any(oU => oU.UpdateName == UpdateName.Completed ||
                                                                                           oU.UpdateName == UpdateName.Cancelled)));

            orders = await _orderRP.IncludeEntities(orders.Select(o => (object)o.Id), o => o.OrderDetails, o => o.OrderUpdates);
            var incldeOrders = new List<Order>();
            foreach (var order in orders)
            {
                var incldeOrder = await _includeWithUser.GetGenericWithUserAsync(order.Id);
                order.User = incldeOrder.User;
                incldeOrders.Add(order);
            }

            return _mapper.Map<ICollection<OrderVM>>(incldeOrders);
        }

        /// <summary>
        /// Create order async
        /// </summary>
        /// <param name="orderDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<OrderVM> CreateOrderAsync(OrderDTO orderDTO)
        {
            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
                    var user = await _userRP.GetAsync(userId);
                    double totalPrice = 0;
                    var cartItems = await _cartRP.GetICollectionAsync(c => c.UserID == userId);
                    if (cartItems == null || !cartItems.Any())
                        throw new Exception("No items in cart.");

                    var order = _mapper.Map<Order>(orderDTO);
                    order.Status = false;
                    order.OrderDate = DateTime.UtcNow;
                    order.UserID = userId;
                    order.Code = Guid.NewGuid().ToString().ToUpper();

                    var createdOrder = await _orderRP.CreateAsync(order);
                    await _unitOfWork.SaveChangesAsync();

                    foreach (var cartItem in cartItems)
                    {
                        var includeCart = await _cartRP.IncludeEntity(cartItem.Id, cart => cart.ProductVariant);
                        var discount = includeCart.ProductVariant.Discount ?? 0;
                        var orderDetail = new OrderDetail
                        {
                            OrderID = createdOrder.Id,
                            ProductVariantID = includeCart.ProductVariantID,
                            Quantity = includeCart.Quantity,
                            Price = includeCart.ProductVariant.Price,
                            Discount = discount,
                            UnitPrice = Math.Floor((double)(includeCart.Quantity * (includeCart.ProductVariant.Price * (discount > 0 ? (1 - (discount / 100)) : 1))))
                        };

                        await _orderDetailRP.CreateAsync(orderDetail);
                        totalPrice += orderDetail.UnitPrice;
                    }

                    // Xóa giỏ hàng sau khi đặt hàng
                    await _cartRP.DeleteRangeAsync(c => c.UserID == userId);

                    // Thêm bản ghi vào bảng OrderUpdate
                    var orderUpdate = new OrderUpdate
                    {
                        UpdateName = 0,
                        UpdateTime = DateTime.UtcNow,
                        Status = true,
                        OrderID = createdOrder.Id
                    };

                    await _orderUpdateRP.CreateAsync(orderUpdate);
                    await _unitOfWork.SaveChangesAsync();

                    var notification = new NotificationDTO
                    {
                        Content = $"<strong>{user.FirstName} {user.LastName}</strong> đã đặt một đơn hàng mới. Mã đơn hàng: <strong><em>{createdOrder.Code}</em></strong> ({totalPrice.ToString("N0", new System.Globalization.CultureInfo("vi-VN"))} NVĐ)",
                        URL = "/orders/unconfirmed",
                        UserRequestID = userId,
                        Icon = user.Avatar,
                    };
                    await _notificationsService.CreateNotificationAsync(notification, new List<string>() { UserRole.Admin, UserRole.StoreManager });

                    //Gửi list order cho admin và store manager qua asignalR (web socket)
                    ICollection<string> roles = new List<string> { UserRole.Admin, UserRole.StoreManager };
                    var userByRoles = (await _userRP.GetUserByRoleName(roles)).Select(u => u.Id).ToList();
                    var allOrdersVM = await GetAllOrderAsync();
                    await _orderSender.SendAllOrderByUserId(userByRoles, allOrdersVM);

                    await _unitOfWork.CommitTransactionAsync();
                    return _mapper.Map<OrderVM>(createdOrder);
                }
                catch (Exception ex) 
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }
            }    
                
        }

        /// <summary>
        /// Create payment url
        /// </summary>
        /// <param name="context"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public string CreatePaymentUrl(HttpContext context, VnPayRequiredModel model)
        {
            var ipAddress = _helpersService.GetIpAddress(context) ;
            return _vnPayService.CreatePaymentUrl(ipAddress, model);
        }

        /// <summary>
        /// Payment excute
        /// </summary>
        /// <param name="collections"></param>
        /// <returns></returns>
        public VnPaymentResponseModel PaymentExcute(IDictionary<string, string> collections)
        {
            return _vnPayService.PaymentExcute(collections);
        }

        /// <summary>
        /// Get gevenue async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<RevenueVM>> GetRevenueAsync()
        {
            var ordersUpdate = await _orderUpdateRP.GetICollectionAsync(oU => oU.UpdateName == UpdateName.Completed);
            if(!ordersUpdate.Any())
            {
                return new List<RevenueVM>();
            }
            ordersUpdate = await _orderUpdateRP.IncludeEntities(ordersUpdate.Select(oU => (object)oU.Id),
                                                                                    oU => oU.Order);
            foreach (var orderUpdate in ordersUpdate) {
                orderUpdate.Order = await _orderRP.IncludeEntity(orderUpdate.Order.Id, o => o.OrderDetails);
            }
            var revenueVMs = ordersUpdate.GroupBy(oU => new { 
                                                 Year = oU.UpdateTime.AddHours(7).Year, 
                                                 Month = oU.UpdateTime.AddHours(7).Month,
                                                 Date = oU.UpdateTime.AddHours(7).Date })
                                         .Select(r => new RevenueVM() {
                                                 SaleDate = r.Key.Date,
                                                 TotalAmount = r.Sum(r => r.Order.OrderDetails.Sum(od => od.UnitPrice)),
                                         })
                                         .ToList();
            
            return revenueVMs;
        }
    }
}
