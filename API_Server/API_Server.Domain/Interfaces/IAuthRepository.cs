using API_Server.Domain.Entities;
using API_Server.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Interfaces
{
    public interface IAuthRepository
    {
        /// <summary>
        /// Register an account async
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task<ICollection<string>> RegisterAsync(User user, string password);

        /// <summary>
        /// Register an user by admin async
        /// </summary>
        /// <param name="user"></param>
        /// <param name="passwork"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public Task<RegisterResponse> RegisterUserByAdminAsync(User user, string passwork, string role);

        /// <summary>
        /// Register an account admin async
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task RegisterAdminAsync();

        /// <summary>
        /// Login to the website async
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task<string> LoginAsync(User user, string password);

        /// <summary>
        /// Change password
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="currentPassword"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        public Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword);

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
        public Task<bool> ResetPasswordAsync(string email, string token, string newPassword);

        /// <summary>
        /// Get all roles async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<string>> GetAllRolesAsync();

        /// <summary>
        ///  Check roles by userId and expressionRole async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="expressionRoles"></param>
        /// <returns></returns>
        public Task<bool> CheckRolesByUserIdAsync(string userId, List<string> expressionRoles);

        /// <summary>
        /// Update am user roles async
        /// </summary>
        /// <param name="updateUserRoles"></param>
        /// <returns></returns>
        public Task<bool> UpdateUserRolesAsync(User updateUserRoles);

    }
}
