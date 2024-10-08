using API_Server.Domain.Entities;
using API_Server.Infastructure.Identity.IdentityModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.JwtService
{
    public class TokensService : ITokensService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public TokensService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        /// <summary>
        /// Create access token async
        /// </summary> 
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<string> CreateAccessTokenAsync(ApplicationUser user, string password)
        {
            //Check if the user exists and is the password validate?
            var findUser = await _userManager.FindByNameAsync(user.UserName);
            var passworkValid = await _userManager.CheckPasswordAsync(findUser, password);

            if (findUser == null || !passworkValid)
            {
                return string.Empty;
            }

            //Add to the token claim
            var authClaims = new List<Claim>
            {
                 new ("UserID", findUser.Id),
                 new ("FirstName", findUser.FirstName),
                 new ("LastName", findUser.LastName),
                 new (ClaimTypes.Email, findUser.Email),
                 new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            //Continue add to the token claim
            var userRole = await _userManager.GetRolesAsync(findUser);
            foreach (var role in userRole)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role.ToString()));
            }

            //Get SymmetricSecurityKey by secret in the configuration program
            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            //Create a object JwtSecurityToken
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddDays(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Create access token for external login async
        /// </summary>
        /// <param name="loginInfo"></param>
        /// <returns></returns>
        public async Task<string> CreateExternalLoginAccessTokenAsync(ApplicationUser user)
        {
            // Add to the token claim
            var authClaims = new List<Claim>
            {
                new ("UserID", user.Id),
                new ("FirstName", user.FirstName),
                new ("LastName", user.LastName),
                new (ClaimTypes.Email, user.Email),
                new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // Continue to add to the token claim
            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Get SymmetricSecurityKey by secret in the configuration program
            var authKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            // Create an object JwtSecurityToken
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddDays(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authKey, SecurityAlgorithms.HmacSha256Signature)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
