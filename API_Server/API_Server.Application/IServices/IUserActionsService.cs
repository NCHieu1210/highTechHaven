using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IUserActionsService
    {
        /// <summary>
        /// Get all user actions async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<UserActionsVM>> GetAllAsync();

        /// <summary>
        /// Create an user action async
        /// </summary>
        /// <param name="userAction"></param>
        /// <returns></returns>
        public Task CreateAsync(UserAction userAction);

        /// <summary>
        /// Delete an user action async
        /// </summary>
        /// <param name="userAction"></param>
        /// <returns></returns>
        public Task<bool> DeleteAsync(int id);
    }
}
