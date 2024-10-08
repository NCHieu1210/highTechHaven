using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.IServices;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API_Server.Application.Helpers;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using API_Server.Domain.IExternalServices;
using API_Server.Domain.Models;

namespace API_Server.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _auth;
        private readonly IGoogleAuthService _googleAuth;
        private readonly IMapper _mapper;
        private readonly IHelpersService _helpersService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IAuthRepository auth, IGoogleAuthService googleAuth, IMapper mapper, IHelpersService helpersService, 
            IHttpContextAccessor httpContextAccessor)
        {
            _auth = auth;
            _googleAuth = googleAuth;
            _mapper = mapper;
            _helpersService = helpersService;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Register an account async
        /// </summary>
        /// <param name="registerDTO"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<ICollection<string>> RegisterAsync(RegisterDTO registerDTO, string password)
        {
            var user = _mapper.Map<User>(registerDTO);
            var setSlug = $"{registerDTO.FirstName}-{registerDTO.LastName}-{Guid.NewGuid()}";

            user.UserName = user.Email;
            user.Avatar = "/images/users/defaultAvatar.png";
            user.Slug = _helpersService.GenerateSlug(setSlug);

            return await _auth.RegisterAsync(user, password);
        }

        /// <summary>
        /// Register an user by admin async
        /// </summary>
        /// <param name="registerByAdminDTO"></param>
        /// <param name="password"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<RegisterResponse> RegisterUserByAdminAsync(RegisterByAdminDTO registerByAdminDTO, string password, string role)
        {
            var user = _mapper.Map<User>(registerByAdminDTO);
            var setSlug = $"{registerByAdminDTO.FirstName}-{registerByAdminDTO.LastName}-{Guid.NewGuid()}";

            user.UserName = user.Email;
            user.Avatar = "/images/users/defaultAvatar.png";
            user.Slug = _helpersService.GenerateSlug(setSlug);
            var result = (await _auth.RegisterUserByAdminAsync(user, password, role));

            return result;
        }

        /// <summary>
        /// Register an account admin async
        /// </summary>
        /// <returns></returns>
        public async Task RegisterAdminAsync()
        {
            await _auth.RegisterAdminAsync();
        }


        /// <summary>
        /// Login to the website async
        /// </summary>
        /// <param name="loginVM"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<string> LoginAsync(LoginVM loginVM, string password)
        {
            var user = _mapper.Map<User>(loginVM);
            return await _auth.LoginAsync(user, password);
        }

        /// <summary>
        /// Get google login url async
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetGoogleLoginUrlAsync()
        {
            return await _googleAuth.GetGoogleLoginUrlAsync();
        }

        /// <summary>
        /// Get google token async
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public async Task<string> GetGoogleTokenAsync(string code)
        {
            return await _googleAuth.GetGoogleTokenAsync(code);
        }

        /// <summary>
        /// Get google user by token async
        /// </summary> 
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string> GetGoogleUserInfoAsync(string token)
        {
            return await _googleAuth.GetGoogleUserInfoAsync(token);
        }

        /// <summary>
        /// Change passwork
        /// </summary>
        /// <param name="changePasswordModel"></param>
        /// <returns></returns>
        public async Task<bool> ChangePasswordAsync(ChangePasswordModel changePasswordModel)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            if (changePasswordModel.NewPassword != changePasswordModel.ConfirmNewPassword)
            {
                throw new Exception("Re-enter incorrect password");
            }
            var result = await _auth.ChangePasswordAsync(userId, changePasswordModel.CurrentPassword, changePasswordModel.ConfirmNewPassword);
            return result;
        }

        /// <summary>
        /// Forgot password async
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task ForgotPasswordAsync(string email)
        {
            await _auth.ForgotPasswordAsync(email); ;
        }

        /// <summary>
        /// Reset password
        /// </summary>
        /// <param name="email"></param>
        /// <param name="token"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        public async Task<bool> ResetPasswordAsync(ResetPasswordDTO resetPasswordDTO)
        {
            if (resetPasswordDTO.NewPassword != resetPasswordDTO.ConfirmNewPassword)
            {
                throw new Exception("Re-enter incorrect password");
            }
            var email = resetPasswordDTO.Email;
            var token = resetPasswordDTO.Token;
            var newPassword = resetPasswordDTO.NewPassword;

            var result = await _auth.ResetPasswordAsync(email, token, newPassword);
            return result;
        }

        /// <summary>
        /// Get all roles async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<string>> GetAllRolesAsync()
        {
            return await _auth.GetAllRolesAsync();
        }

    }
}
