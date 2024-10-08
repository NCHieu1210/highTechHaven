using API_Server.Application.ApplicationModels.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface ITrashService
    {
        /// <summary>
        /// Get all products and posts in the trash async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<TrashVM>> GetAllAsyc();

        /// <summary>
        /// Get product and post by id in the trash async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<TrashVM> GetByIdAsync(int id);

        /// <summary>
        /// Restore product and post by id in the trash async
        /// </summary>
        /// <param name="idProduct"></param>
        /// <param name="idPost"></param>
        /// <returns></returns>
    }
}
