using API_Server.Domain.IExternalServices;
using API_Server.Infastructure.Identity.IdentityModels;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using API_Server.Infastructure.ConfigureSettings;
using Microsoft.Extensions.Options;
using API_Server.Infastructure.JwtService;

namespace API_Server.Infastructure.ExternalServices
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly ITokensService _tokensService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly HttpClient _httpClient;
        private readonly SignInGoogleSettings _googleAuthSettings;

        public GoogleAuthService(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager,
            ITokensService tokensService, IOptions<SignInGoogleSettings> googleAuthSettings)
        {
            _googleAuthSettings = googleAuthSettings.Value;
            _httpClient = new HttpClient();
            _tokensService = tokensService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        /// <summary>
        /// Get google login url
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetGoogleLoginUrlAsync()
        {

            var url = $"https://accounts.google.com/o/oauth2/v2/auth?client_id={_googleAuthSettings.ClientId}&redirect_uri={_googleAuthSettings.RedirectUri}&response_type=code&scope=openid%20email%20profile";
            return url;
        }

        /// <summary>
        /// Get google token async
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<string> GetGoogleTokenAsync(string code)
        {
            var url = "https://oauth2.googleapis.com/token";

            /* var userInfo = await _authService.GetGoogleUserInfoAsync(token);*/

            var data = new Dictionary<string, string>
            {
                {"code", code},
                {"client_id", _googleAuthSettings.ClientId},
                {"client_secret", _googleAuthSettings.ClientSecret},
                {"redirect_uri", _googleAuthSettings.RedirectUri},
                {"grant_type", "authorization_code"}
            };

            var response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(data));
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("An error occurred while exchanging code for token");
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            var tokenResponse = JObject.Parse(responseBody);
            return tokenResponse["access_token"].ToString();
        }

        /// <summary>
        /// Get google user info async
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string> GetGoogleUserInfoAsync(string token)
        {
            var url = $"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                return $"Có lỗi xảy ra khi lấy thông tin người dùng: {errorResponse}";
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            var googleUserInfo = JsonConvert.DeserializeObject<GoogleUserInfo>(responseBody);

            // Tìm kiếm người dùng theo email
            var user = await _userManager.FindByEmailAsync(googleUserInfo.Email);

            // Nếu người dùng đã tồn tại, tạo token và trả về
            if (user != null)
            {
                var resToken = await _tokensService.CreateExternalLoginAccessTokenAsync(user);
                await _signInManager.ExternalLoginSignInAsync("Google", googleUserInfo.Id, isPersistent: false);
                return resToken;
            }

            // Nếu người dùng chưa tồn tại, tạo mới và đăng nhập
            user = new ApplicationUser
            {
                UserName = googleUserInfo.Email,
                Email = googleUserInfo.Email,
                FirstName = googleUserInfo.GivenName,
                LastName = googleUserInfo.FamilyName,
                Avatar = "/images/users/defaultAvatar.png",
                Slug = $"{Guid.NewGuid()}",
                EmailConfirmed = true,
            };

            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, ApplicationRole.Customer);
            }
            if (!result.Succeeded)
            {
                return "Failed to create new user";
            }

            var loginInfo = new UserLoginInfo("Google", googleUserInfo.Id, "Google");
            await _userManager.AddLoginAsync(user, loginInfo);

            var newToken = await _tokensService.CreateExternalLoginAccessTokenAsync(user);
            await _signInManager.ExternalLoginSignInAsync("Google", googleUserInfo.Id, isPersistent: false);

            return newToken;
        }
    }
}
