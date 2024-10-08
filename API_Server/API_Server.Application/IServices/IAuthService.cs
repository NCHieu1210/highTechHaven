using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using API_Server.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IAuthService
    {
        /// <summary>
        /// Register an account async
        /// </summary>
        /// <param name="registerDTO"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task<ICollection<string>> RegisterAsync(RegisterDTO registerDTO, string password);

        /// <summary>
        /// Register an user by admin async
        /// </summary>
        /// <param name="registerDTO"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task<RegisterResponse> RegisterUserByAdminAsync(RegisterByAdminDTO registerDTO, string password, string role);

        /// <summary>
        /// Register a account admin async
        /// </summary>
        /// <param name="registerDTO"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task RegisterAdminAsync();

        /// <summary>
        /// Login to the website account async
        /// </summary>
        /// <param name="loginVM"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task<string> LoginAsync(LoginVM loginVM, string password);

        /// <summary>
        /// Get google login url
        /// </summary>
        /// <returns></returns>
        public Task<string> GetGoogleLoginUrlAsync();

        /// <summary>
        /// Get google token async
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public Task<string> GetGoogleTokenAsync(string code);

        /// <summary>
        /// Get google user info by token async
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public Task<string> GetGoogleUserInfoAsync(string token);

        /// <summary>
        /// Change password async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="currentPassword"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        public Task<bool> ChangePasswordAsync(ChangePasswordModel changePasswordModel);

        /// <summary>
        /// Forgot password async
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public Task ForgotPasswordAsync(string email);

        /// <summary>
        /// Reset password async
        /// </summary>
        /// <param name="email"></param>
        /// <param name="token"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        Task<bool> ResetPasswordAsync(ResetPasswordDTO resetPasswordDTO);

        /// <summary>
        /// Get all roles async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<string>> GetAllRolesAsync();
    }
}
