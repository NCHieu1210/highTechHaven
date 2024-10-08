using API_Server.Application.IServices;
using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ViewModels;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Channels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using API_Server.Infastructure.Identity.IdentityModels;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Configuration;
using Newtonsoft.Json.Linq;

namespace API_Server.API.Controllers.User
{
    #region End user modules
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register an account
        /// </summary>
        /// <param name="registerDTO"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromForm] RegisterDTO registerDTO)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDTO, registerDTO.Password);
                if (result.Count != 0)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Register failed!",
                        Data = result
                    });
                }
                else
                {
                    return Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Register access!",
                        Data = result
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        /// <summary>
        /// Register an account admim
        /// </summary>
        /// <returns></returns>
        [HttpPost("register/admin")]
        public async Task<IActionResult> RegisterAdminAsync()
        {
            await _authService.RegisterAdminAsync();
            return NoContent();
        }

        /// <summary>
        /// Login to the website
        /// </summary>
        /// <param name="loginVM"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync(LoginVM loginVM)
        {
            try
            {
                var result = await _authService.LoginAsync(loginVM, loginVM.Password);
                if (string.IsNullOrEmpty(result))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Authenticate failed!",
                        Data = result
                    });
                }
                else
                {
                    return Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Authenticate success!",
                        Data = result
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromForm] ChangePasswordModel changePasswordModel)
        {
            try
            {
                var result = await _authService.ChangePasswordAsync(changePasswordModel);
                if(result)
                {
                    return Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Password changed successfully",
                        Data = ""
                    });
                }    
                else {
                    return BadRequest(new ApiResponse
                    {
                        Success = true,
                        Message = "Password changed failed",
                        Data = ""
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = ""
                });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            try
            {
                await _authService.ForgotPasswordAsync(email);
                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Password reset link has been sent to your email",
                    Data = ""
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = ""
                });
            }
            
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordDTO)
        {
            try
            {
                var result = await _authService.ResetPasswordAsync(resetPasswordDTO);
                if (!result)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Error resetting password",
                        Data = ""
                    });
                }

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Password has been reset successfully",
                    Data = ""
                });
            }
            catch(Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = ""
                });
            }
        }

        //Get google login url
        [HttpGet("google-login")]
        public async Task<IActionResult> GoogleLogin()
        {
            var loginUrl = await _authService.GetGoogleLoginUrlAsync();
            return Ok(new ApiResponse
            {
                Success = true,
                Message = "Get google login url successfully",
                Data = loginUrl
            });
        }

        /// <summary>
        /// Call back
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback(string code)
        {
            var token = await _authService.GetGoogleTokenAsync(code);
            var userInfoToken = await _authService.GetGoogleUserInfoAsync(token);
            return Redirect($"http://localhost:3000/login-with-google/?token={userInfoToken}");
        }
    }

    #endregion
}
