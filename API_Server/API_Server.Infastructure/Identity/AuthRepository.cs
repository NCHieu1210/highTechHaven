using API_Server.Domain.Entities;
using API_Server.Domain.IExternalServices;
using API_Server.Domain.Interfaces;
using API_Server.Domain.Models;
using API_Server.Infastructure.ConfigureSettings;
using API_Server.Infastructure.Identity.IdentityModels;
using API_Server.Infastructure.JwtService;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace API_Server.Infastructure.Identity
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokensService _tokensService;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;

        public AuthRepository(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, 
            RoleManager<IdentityRole> roleManager, ITokensService tokensService, IMapper mapper, IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _tokensService = tokensService;
            _mapper = mapper;
            _emailSender = emailSender;
        }

        /// <summary>
        /// Register an account
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<ICollection<string>> RegisterAsync(User user, string password)
        {
            var appUser = _mapper.Map<ApplicationUser>(user);
            var result = await _userManager.CreateAsync(appUser, password);
            if (result.Succeeded) 
            {
                await _userManager.AddToRoleAsync(appUser, ApplicationRole.Customer);
            }
            return result.Errors.Select(e => e.Description).ToList();
        }

        /// <summary>
        /// Register an user by admin async
        /// </summary>
        /// <param name="user"></param>
        /// <param name="passwork"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<RegisterResponse> RegisterUserByAdminAsync(User user, string password, string role)
        {
            var applicationUser = _mapper.Map<ApplicationUser>(user);
            var result = await _userManager.CreateAsync(applicationUser, password);

            var registerResponse = new RegisterResponse {
                Success = false,
                Id = applicationUser.Id,
                FirstName = applicationUser.FirstName,
                LastName = applicationUser.LastName,
                UserName = applicationUser.UserName,
                Email = applicationUser.Email,
            };

            if (result.Succeeded)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
                await _userManager.AddToRoleAsync(applicationUser, role);
                registerResponse.Success = true;
            }
            registerResponse.Errors = result.Errors.Select(e => e.Description).ToList();

            return registerResponse;
        }

        /// <summary>
        /// Register a user admin async
        /// </summary>
        /// <returns></returns>
        public async Task RegisterAdminAsync()
        {
            ApplicationUser admin = new ApplicationUser
            {
                Avatar = "/images/users/avatarAdmin.png",
                FirstName = "System",
                LastName = "Admin",
                Slug = "system-admin",
                UserName = "admin@hth.com",
                Email = "admin@hth.com",
                Birthday = new DateTime(2001, 10, 12, 20, 30, 0), // Year, Month, day, hour, minute, second
                PhoneNumber = "0379903378",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
            };
            string password = "Admin@123";
            var result = await _userManager.CreateAsync(admin, password);
            if(result.Succeeded)
            {
                await _userManager.AddToRoleAsync(admin, ApplicationRole.Admin);
                await _userManager.AddToRoleAsync(admin, ApplicationRole.StoreManager);
                await _userManager.AddToRoleAsync(admin, ApplicationRole.Marketing);
                await _userManager.AddToRoleAsync(admin, ApplicationRole.Customer);
            }
        }


        /// <summary>
        /// Login to the website
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<string> LoginAsync(User user, string password)
        {
            var appUser = _mapper.Map<ApplicationUser>(user);

            var result = await _signInManager.PasswordSignInAsync(appUser.UserName, password, false, false);
            if (!result.Succeeded)
            {
                return string.Empty;
            }

            var token = await _tokensService.CreateAccessTokenAsync(appUser, password);

            return token;
        }

        /// <summary>
        /// Change Password
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="currentPassword"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var appUser = await _userManager.FindByIdAsync(userId);
            if (appUser == null)
            {
                throw new Exception("User not found");
            }

            var result = await _userManager.ChangePasswordAsync(appUser, currentPassword, newPassword);
            return result.Succeeded;
        }

        /// <summary>
        /// Forgot password async
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task ForgotPasswordAsync(string email)
        {
            var appUser = await _userManager.FindByEmailAsync(email);
            if (appUser == null)
            {
                throw new Exception("User not found!");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(appUser);
            var resetLink = $"http://hth-ecom.vercel.app/reset-password?token={Uri.EscapeDataString(token)}";

            await _emailSender.SendEmailAsync(email, "Lấy lại mậy khẩu", $"Vui lòng đặt lại mật khẩu của bạn bằng liên kết sau: {resetLink}");
        }

        /// <summary>
        /// Reset password
        /// </summary>
        /// <param name="email"></param>
        /// <param name="token"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var appUser = await _userManager.FindByEmailAsync(email);
            if (appUser == null)
            {
                return false;
            }
            var result = await _userManager.ResetPasswordAsync(appUser, token, newPassword);
            return result.Succeeded;
        }

        /// <summary>
        /// Get all roles async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<string>> GetAllRolesAsync()
        {
            return await Task.FromResult(_roleManager.Roles.Select(r => r.Name).ToList());
        }

        /// <summary>
        ///  Check roles by userId and expressionRole async
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="expressionRoles"></param>
        /// <returns></returns>
        public async Task<bool> CheckRolesByUserIdAsync(string userId, List<string> expressionRoles)
        {
            var user = await _userManager.FindByIdAsync(userId) ?? throw new KeyNotFoundException("User not found");
            var currentRoles = await _userManager.GetRolesAsync(user);

            return currentRoles.Any(role => expressionRoles.Contains(role));
        }

        /// <summary>
        /// Update user roles async
        /// </summary>
        /// <param name="updateUserRoles"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<bool> UpdateUserRolesAsync(User updateUserRoles)
        {
            var user = await _userManager.FindByIdAsync(updateUserRoles.Id) ?? throw new KeyNotFoundException("User not found");

            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToAdd = updateUserRoles.Roles.Except(currentRoles).ToList();
            var rolesToRemove = currentRoles.Except(updateUserRoles.Roles).ToList();

            var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            if(!removeResult.Succeeded)
            {
                throw new Exception("Failed to remove user roles");
            }

            var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
            if (!addResult.Succeeded)
            {
                throw new Exception("Failed to add user roles");
            }

            return true;

        }
    }
}
