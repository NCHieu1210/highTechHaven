using API_Server.Infastructure.Identity.IdentityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.JwtService
{
    public interface ITokensService
    {
        /// <summary>
        /// Create access token async
        /// </summary> 
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Task<string> CreateAccessTokenAsync(ApplicationUser user, string password);

        /// <summary>
        /// Create access token for external login async
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<string> CreateExternalLoginAccessTokenAsync(ApplicationUser user);

    }
}
