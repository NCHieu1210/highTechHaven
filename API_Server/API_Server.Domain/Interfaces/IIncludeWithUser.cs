using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Interfaces
{
    public interface IIncludeWithUser<T> where T : class
    {

        /// <summary>
        /// Get entity that include user async
        /// </summary>
        /// <param name="entityId"></param>
        /// <returns></returns>
        public Task<T> GetGenericWithUserAsync(int entityId);

        /// <summary>
        /// Get entities that include user async
        /// </summary>
        /// <param name="entityIds"></param>
        /// <returns></returns>
        public Task<ICollection<T>> GetGenericWithUserAsync(ICollection<int> entityIds);

    }
}
