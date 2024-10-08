using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.ISender;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class OrderUpdatesService: IOrderUpdatesService
    {
        private readonly IGenericRepository<OrderUpdate> _orderUpdateRP;
        private readonly IGenericRepository<Order> _orderRP;
        private readonly IGenericRepository<OrderDetail> _orderDetailRP;
        private readonly IGenericRepository<Product> _productRP;
        private readonly IGenericRepository<ProductVariant> _productVariantRP;
        private readonly IIncludeWithUser<Order> _includeUser;
        private readonly IOrdersService _ordersService;
        private readonly IOrderSender _orderSender;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly INotificationsService _notificationsService;
        private readonly IUsersRepository _userRP;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderUpdatesService( IUnitOfWork unitOfWork, IMapper mapper, INotificationsService notificationsService,
            IHttpContextAccessor httpContextAccessor, IUsersRepository usersRepository, IOrdersService ordersService,
            IOrderSender orderSender)
        {
            _unitOfWork = unitOfWork;
            _orderUpdateRP = _unitOfWork.RepositoryOrderUpdates;
            _orderRP = _unitOfWork.RepositoryOrders;
            _orderDetailRP = _unitOfWork.RepositoryOrderDetails;
            _productRP = _unitOfWork.RepositoryProducts;
            _productVariantRP = _unitOfWork.RepositoryProductVariants;
            _includeUser = _unitOfWork.IncludeOrderWithUser;

            _ordersService = ordersService;
            _orderSender = orderSender;
            _httpContextAccessor = httpContextAccessor;
            _notificationsService = notificationsService;
            _userRP = usersRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Change order status async
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<OrderUpdateVM> ChangeOrderStatusAsync(int orderId)
        {
            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    // Lấy Order hiện tại
                    var order = await _orderRP.GetAsync(orderId);
                    order = await _includeUser.GetGenericWithUserAsync(order.Id);
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
                    if (order == null)
                    {
                        throw new Exception("Order not found.");
                    }

                    // Lấy trạng thái hiện tại của Order
                    var currentUpdate = await _orderUpdateRP.GetAsync(o => o.OrderID == orderId && o.Status);
                    if (currentUpdate == null)
                    {
                        throw new Exception("No active order update found.");
                    }

                    // Kiểm tra nếu đơn hàng đã bị hủy
                    if (currentUpdate.UpdateName == UpdateName.Cancelled)
                    {
                        throw new Exception("Order has already been cancelled.");
                    }

                    // Kiểm tra nếu UpdateName chuyển từ 0 (Unconfirmed) sang 1 (Processing)
                    if (currentUpdate.UpdateName == UpdateName.Unconfirmed && currentUpdate.UpdateName + 1 == UpdateName.Processing)
                    {
                        // Lấy danh sách OrderDetails
                        var orderDetails = await _orderDetailRP.GetICollectionAsync(od => od.OrderID == orderId);

                        foreach (var detail in orderDetails)
                        {
                            var productVariant = await _productVariantRP.GetAsync(detail.ProductVariantID);

                            if (productVariant.Stock < detail.Quantity)
                            {
                                string name = $"{productVariant.ProductOption.Product.Name} " +
                                              $"{productVariant.ProductOption.ProductOptionType.Option} " +
                                              $"{productVariant.ProductColor.Color}";

                                throw new Exception($"Không đủ hàng cho sản phẩm: {name}");
                            }
                        }

                        // Nếu đủ tồn kho, cập nhật tồn kho và số lượng bán
                        foreach (var detail in orderDetails)
                        {
                            var productVariant = await _productVariantRP.GetAsync(detail.ProductVariantID);
                            productVariant.Stock -= detail.Quantity;
                            productVariant.SellNumbers += detail.Quantity;
                            await _productVariantRP.UpdateAsync(productVariant.Id, productVariant);
                        }
                    }

                    // Cập nhật trạng thái hiện tại thành false
                    currentUpdate.Status = false;
                    await _orderUpdateRP.UpdateAsync(currentUpdate.Id, currentUpdate);

                    // Tạo trạng thái mới
                    var newUpdateName = currentUpdate.UpdateName + 1;
                    if (!Enum.IsDefined(typeof(UpdateName), newUpdateName))
                    {
                        throw new Exception("Invalid order status transition.");
                    }

                    var newOrderUpdate = new OrderUpdate
                    {
                        OrderID = orderId,
                        UpdateName = newUpdateName,
                        UpdateTime = DateTime.UtcNow,
                        Status = true
                    };

                    // Thêm trạng thái mới vào cơ sở dữ liệu
                    await _orderUpdateRP.CreateAsync(newOrderUpdate);
                    await _unitOfWork.SaveChangesAsync();
                    //Tạo thông báo tới người dùnng
                    var notification = new NotificationDTO();
                    switch (newOrderUpdate.UpdateName)
                    {
                        case UpdateName.Processing:
                            notification.Icon = "/images/users/avatarAdmin.png";
                            notification.Content = $"Xin chào {order.User.FirstName} {order.User.LastName}! Đơn hàng <strong><em>{order.Code}</em></strong> của bạn đã được xác nhận!";
                            notification.UserRequestID = userId;
                            notification.UserResponseID = order.User.Id;
                            notification.URL = "/user/orders";
                            break;
                        case UpdateName.Delivering:
                            notification.Icon = "/images/users/avatarAdmin.png";
                            notification.Content = $"Xin chào {order.User.FirstName} {order.User.LastName}! Đơn hàng <strong><em>{order.Code}</em></strong> của bạn đã được gửi đi!";
                            notification.UserRequestID = userId;
                            notification.UserResponseID = order.User.Id;
                            notification.URL = "/user/orders";
                            break;
                        case UpdateName.Completed:
                            notification.Icon = "/images/users/avatarAdmin.png";
                            notification.Content = $"Xin chào {order.User.FirstName} {order.User.LastName}! Đơn hàng <strong><em>{order.Code}</em></strong> của bạn đã hoàn thành!";
                            notification.UserRequestID = userId;
                            notification.UserResponseID = order.User.Id;
                            notification.URL = "/user/orders-history";
                            break;
                    }    

                    //Tạo thông báo
                    await _notificationsService.CreateNotificationAsync(notification, new List<string>());

                    //Gửi list order cho user qua asignalR (web socket)
                    var ordersVM = await _ordersService.GetOrderByUserIdAsync(order.UserID);
                    await _orderSender.SendAllOrderByUserId(order.UserID, ordersVM);

                    //Gửi list order cho admin và store manager qua asignalR (web socket)
                    ICollection<string> roles = new List<string> { UserRole.Admin, UserRole.StoreManager };
                    var userByRoles = (await _userRP.GetUserByRoleName(roles)).Select(u => u.Id).ToList();
                    var allOrdersVM = await _ordersService.GetAllOrderAsync();
                    await _orderSender.SendAllOrderByUserId(userByRoles, allOrdersVM);

                    await _unitOfWork.CommitTransactionAsync();
                    return _mapper.Map<OrderUpdateVM>(newOrderUpdate);
                }
                catch (Exception ex) {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }
            }
                
        }

        /// <summary>
        /// Cancel order async
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<OrderUpdateVM> CancelOrderAsync(int orderId)
        {
            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
                    var user = await _userRP.GetAsync(userId);
                    // Lấy Order hiện tại
                    var order = await _orderRP.GetAsync(orderId);
                    if (order == null)
                    {
                        throw new Exception("Order not found.");
                    }

                    // Lấy trạng thái hiện tại của Order
                    var currentUpdate = await _orderUpdateRP.GetAsync(o => o.OrderID == orderId && o.Status);
                    if (currentUpdate == null)
                    {
                        throw new Exception("No active order update found.");
                    }

                    // Kiểm tra nếu đơn hàng đã bị hủy
                    if (currentUpdate.UpdateName == UpdateName.Cancelled)
                    {
                        throw new Exception("Order has already been cancelled.");
                    }

                    // Kiểm tra nếu đơn hàng đã bị hủy
                    if (currentUpdate.UpdateName == UpdateName.Completed)
                    {
                        throw new Exception("Order has already been cancelled.");
                    }

                    // Cập nhật trạng thái hiện tại thành false
                    currentUpdate.Status = false;
                    await _orderUpdateRP.UpdateAsync(currentUpdate.Id, currentUpdate);

                    // Tạo trạng thái hủy
                    var cancelOrderUpdate = new OrderUpdate
                    {
                        OrderID = orderId,
                        UpdateName = UpdateName.Cancelled,
                        UpdateTime = DateTime.UtcNow,
                        Status = true
                    };

                    // Kiểm tra nếu UpdateName chuyển từ 0 (Unconfirmed) sang 1 (Processing)
                    if (currentUpdate.UpdateName != UpdateName.Unconfirmed)
                    {
                        // Lấy danh sách OrderDetails
                        var orderDetails = await _orderDetailRP.GetICollectionAsync(od => od.OrderID == orderId);

                        // Cập nhật tồn kho và số lượng bán
                        foreach (var detail in orderDetails)
                        {
                            var productVariant = await _productVariantRP.GetAsync(detail.ProductVariantID);
                            productVariant.Stock += detail.Quantity;
                            productVariant.SellNumbers -= detail.Quantity;
                            await _productVariantRP.UpdateAsync(productVariant.Id, productVariant);
                        }
                    }

                    // Thêm trạng thái hủy vào cơ sở dữ liệu
                    await _orderUpdateRP.CreateAsync(cancelOrderUpdate);
                    await _unitOfWork.SaveChangesAsync();

                    //Tạo thông báo tới người dùnng
                    var orderUpdateAfterCancel = await _orderUpdateRP.IncludeEntity(cancelOrderUpdate.Id, o => o.Order);
                    if(orderUpdateAfterCancel.Order.UserID == userId)
                    {
                        orderUpdateAfterCancel.Order = await _includeUser.GetGenericWithUserAsync(orderUpdateAfterCancel.OrderID);
                        var notification = new NotificationDTO()
                        {
                            URL = "/orders/cancelled",
                            Content = $"<strong>{user.FirstName} {user.LastName}</strong> đã hủy đơn hàng <strong><em>{orderUpdateAfterCancel.Order.Code}</em></strong>",
                            Icon = user.Avatar,
                            UserRequestID = user.Id,
                        };

                        await _notificationsService.CreateNotificationAsync(notification, new List<string>() { UserRole.Admin, UserRole.StoreManager});

                    }
                    else
                    {
                        orderUpdateAfterCancel.Order = await _includeUser.GetGenericWithUserAsync(orderUpdateAfterCancel.OrderID);
                        var notification = new NotificationDTO()
                        {
                            URL = "/user/orders-history",
                            Content = $"Xin chào {orderUpdateAfterCancel.Order.User.FirstName} {orderUpdateAfterCancel.Order.User.LastName}. Đơn hàng <strong><em>{orderUpdateAfterCancel.Order.Code}</em></strong> của bạn đã bị hủy, chúng tôi xin lỗi về sự bất tiện này!",
                            Icon = "/images/users/avatarAdmin.png",
                            UserRequestID = user.Id,
                            UserResponseID = orderUpdateAfterCancel.Order.UserID,
                        };

                        await _notificationsService.CreateNotificationAsync(notification, new List<string>());

                    }

                    ICollection<string> roles = new List<string> { UserRole.Admin, UserRole.StoreManager };
                    var userByRoles = (await _userRP.GetUserByRoleName(roles)).Select(u => u.Id).ToList();

                    var ordersVM = await _ordersService.GetOrderByUserIdAsync(order.UserID);
                    var allOrdersVM = await _ordersService.GetAllOrderAsync();
                    await _orderSender.SendAllOrderByUserId(order.UserID, ordersVM);
                    await _orderSender.SendAllOrderByUserId(userByRoles, allOrdersVM);

                    await _unitOfWork.CommitTransactionAsync();
                    return _mapper.Map<OrderUpdateVM>(cancelOrderUpdate);
                }
                catch (Exception ex) {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw new Exception(ex.Message);
                }
            }      
        }
    }
}
