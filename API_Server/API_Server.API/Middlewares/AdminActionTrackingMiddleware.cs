using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.Entities;
using API_Server.Domain.Models;
using API_Server.Infastructure.Data;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Policy;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_Server.API.Middlewares
{
    public class AdminActionTrackingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        // Constructor nhận vào RequestDelegate và IServiceScopeFactory
        public AdminActionTrackingMiddleware(RequestDelegate next, IServiceScopeFactory serviceScopeFactory)
        {
            _next = next;
            _serviceScopeFactory = serviceScopeFactory;
        }

        // Phương thức InvokeAsync được gọi cho mỗi yêu cầu HTTP
        public async Task InvokeAsync(HttpContext context)
        {
            // Lấy URL từ yêu cầu
            var path = context.Request.Path;
            // Kiểm tra xác thực và role của user
            if (path.Value.Contains("admin") && context.User.Identity.IsAuthenticated &&
                (context.User.IsInRole(UserRole.Admin) || context.User.IsInRole(UserRole.Marketing)
                    || context.User.IsInRole(UserRole.StoreManager)))
            {
                // Lấy Method của Request
                var method = context.Request.Method;

                // Lấy tên entity từ URL
                var entity = GetEntityFromPath(path, 3);
                var checkRestore = GetEntityFromPath(path, 4);
                string entityName = null;

                // Xử lý các phương thức HTTP cụ thể
                if (method == "POST" || method == "PUT" || method == "DELETE")
                {
                    switch (checkRestore)
                    {
                        case "Restore":
                            method = "RESTORE";
                            break;
                        case "RestoreRange":
                            method = "RESTORE_RANGE";
                            break;
                        case "PermanentlyDeleted":
                            method = "PERMANENTLY_DELETE";
                            break;
                    }
                    if (method != "DELETE" && context.Request.HasFormContentType)
                    {
                        var form = await context.Request.ReadFormAsync();
                        if (form.ContainsKey("name"))
                        {
                            entityName = form["name"];
                        }
                    }

                    // Lưu phản hồi gốc của HTTP vào stream tạm thời
                    var originalBodyStream = context.Response.Body;
                    using var responseBody = new MemoryStream();
                    context.Response.Body = responseBody;

                    // Tiếp tục pipeline
                    await _next(context);

                    // Đọc nội dung phản hồi
                    context.Response.Body.Seek(0, SeekOrigin.Begin);
                    var responseText = await new StreamReader(context.Response.Body).ReadToEndAsync();
                    context.Response.Body.Seek(0, SeekOrigin.Begin);

                    // Lấy mã trạng thái HTTP
                    var statusCode = context.Response.StatusCode;

                    if (statusCode >= 200 && statusCode < 300)
                    {
                        // Tạo scope mới để sử dụng dịch vụ Scoped
                        using var scope = _serviceScopeFactory.CreateScope();
                        var userActionService = scope.ServiceProvider.GetRequiredService<IUserActionsService>();
                        var userId = context.User.FindFirst("UserID")?.Value;

                        if (path.Value.Contains("/DeleteRange"))
                        {
                            var entityID = ExtractListEntityDataFromBody(responseText, "id");
                            for (int i = 0; i < entityID.Count; i++)
                            {
                                var userAction = new UserAction
                                {
                                    ActionType = "DELETE_RANGE",
                                    Area = "ADMIN",
                                    UserID = userId,
                                    Entity = entity,
                                    EntityName = ExtractListEntityDataFromBody(responseText, "name")[i].ToString(),
                                    EntityId = entityID[i],
                                    Url = path,
                                };
                                await userActionService.CreateAsync(userAction);
                            }
                        }

                        else if (path.Value.Contains("/RestoreRange"))
                        {
                            var entityID = ExtractListEntityDataFromBody(responseText, "id");
                            for (int i = 0; i < entityID.Count; i++)
                            {
                                var userAction = new UserAction
                                {
                                    ActionType = "RESTORE_RANGE",
                                    Area = "ADMIN",
                                    UserID = userId,
                                    Entity = entity,
                                    EntityName = ExtractListEntityDataFromBody(responseText, "name")[i].ToString(),
                                    EntityId = entityID[i],
                                    Url = path,
                                };
                                await userActionService.CreateAsync(userAction);
                            }
                        }
                        else if (path.Value.Contains("/Register") || path.Value.Contains("/Update") || path.Value.Contains("/Delete"))
                        {
                            // Tạo đối tượng UserAction
                            var userAction = new UserAction
                            {
                                ActionType = method,
                                Area = "ADMIN",
                                UserID = userId,
                                Entity = entity,
                                EntityName = ExtractEntityDataFromBody(responseText, "userName").ToString(),
                                Url = path
                            };
                            // Cập nhật thông tin hành động người dùng
                            UpdateUserAction(userAction, method, path, responseText);

                            // Lưu hành động người dùng vào cơ sở dữ liệu
                            await userActionService.CreateAsync(userAction);
                        }

                        else if (method == "POST" && path.Value.Contains("/ChangeStatus") || path.Value.Contains("/Cancel"))
                        {
                            // Tạo đối tượng UserAction
                            var userAction = new UserAction
                            {
                                ActionType = ExtractEntityDataFromBody(responseText, "updateName").ToString(),
                                Area = "ADMIN",
                                UserID = userId,
                                Entity = entity,
                                EntityName = ExtractEntityDataFromBody(responseText, "codeOrder").ToString(),
                                Url = path
                            };
                            // Cập nhật thông tin hành động người dùng
                            UpdateUserAction(userAction, method, path, responseText);

                            // Lưu hành động người dùng vào cơ sở dữ liệu
                            await userActionService.CreateAsync(userAction);
                        }

                        else
                        {
                            // Tạo đối tượng UserAction
                            var userAction = new UserAction
                            {
                                ActionType = method,
                                Area = "ADMIN",
                                UserID = userId,
                                Entity = entity,
                                EntityName = entityName,
                                Url = path
                            };
                            // Cập nhật thông tin hành động người dùng
                            UpdateUserAction(userAction, method, path, responseText);

                            // Lưu hành động người dùng vào cơ sở dữ liệu
                            await userActionService.CreateAsync(userAction);
                        }
                    }

                    // Sao chép dữ liệu từ stream tạm thời trở lại stream gốc
                    await responseBody.CopyToAsync(originalBodyStream);
                }
                else
                {
                    // Tiếp tục pipeline nếu không phải là các phương thức HTTP được xử lý
                    await _next(context);
                }
            }
            else
            {
                // Tiếp tục pipeline nếu không xác thực hoặc không có quyền
                await _next(context);
            }
        }

        // Cập nhật thông tin hành động người dùng dựa trên phương thức HTTP
        private static void UpdateUserAction(UserAction userAction, string method, PathString path, string responseText)
        {
            switch (method)
            {
                case "POST":
                case "PUT":
                        userAction.EntityId = ExtractEntityDataFromBody(responseText, "id");
                    break;

                case "DELETE":
                    if (!path.Value.Contains("/DeleteRange") && !path.Value.Contains("/Users/Delete"))
                    {
                        userAction.EntityName = ExtractEntityDataFromBody(responseText, "name");
                        userAction.EntityId = ExtractEntityDataFromBody(responseText, "id");
                    }
                    break;

                case "PERMANENTLY_DELETE":
                    userAction.EntityName = ExtractEntityDataFromBody(responseText, "name");
                    userAction.EntityId = ExtractEntityDataFromBody(responseText, "id");
                    break;

                case "RESTORE":
                    userAction.EntityName = ExtractEntityDataFromBody(responseText, "name");
                    userAction.EntityId = ExtractEntityDataFromBody(responseText, "id");
                    break;

            }
        }

        // Lấy giá trị theo index của URL
        private static string GetEntityFromPath(PathString path, int index)
        {
            var segments = path.Value.Split('/');
            return segments.Length > index ? segments[index] ?? "Unknown" : "Unknown";
        }

        // Trích xuất giá trị của thuộc tính từ phản hồi JSON
        private static string ExtractEntityDataFromBody(string responseBody, string property)
        {
            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var entity = JsonSerializer.Deserialize<JsonElement>(responseBody, options);

                if (entity.TryGetProperty("data", out var resultProperty))
                {
                    //Kiểm tra nếu Reponse body không phải là 1 mảng
                    if (resultProperty.ValueKind == JsonValueKind.Object)
                    {
                        if (resultProperty.TryGetProperty(property, out var valueProperty))
                        {
                            return valueProperty.ToString();
                        }
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch
            {
                // Handle exception if needed
            }
            return null;
        }

        private static List<string> ExtractListEntityDataFromBody(string responseBody, string property)
        {
            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var entity = JsonSerializer.Deserialize<JsonElement>(responseBody, options);
                var values = new List<string>();

                if (entity.TryGetProperty("data", out var resultProperty))
                {
                    //Kiểm tra nếu Reponse body là 1 mảng
                    if (resultProperty.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var item in resultProperty.EnumerateArray())
                        {
                            if (item.TryGetProperty(property, out var valueProperty))
                            {
                                values.Add(valueProperty.ToString());
                            }
                        }
                        return values;
                    }
                }
            }
            catch
            {
                // Handle exception if needed
            }
            return null;
        }

    }


    // Đăng ký middleware
    public static class UserActionTrackingMiddlewareExtensions
    {
        public static IApplicationBuilder UseUserActionTracking(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AdminActionTrackingMiddleware>();
        }
    }
}
