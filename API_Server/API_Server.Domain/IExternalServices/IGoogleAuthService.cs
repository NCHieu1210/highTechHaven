using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.IExternalServices
{
    public interface IGoogleAuthService
    {
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
    }
}
