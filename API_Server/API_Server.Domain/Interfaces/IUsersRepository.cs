using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Interfaces
{
    public interface IUsersRepository : IGenericRepository<User>
    {
        /// <summary>
        ///  Get roles by user Id
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public Task<ICollection<string>> GetRolesByUserID(string userID);

        /// <summary>
        /// Get user by role name
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public Task<ICollection<User>> GetUserByRoleName(ICollection<string> roleNames);

    }
}
