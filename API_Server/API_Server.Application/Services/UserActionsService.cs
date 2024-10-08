using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class UserActionsService : IUserActionsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<UserAction> _userAction;
        private readonly IIncludeWithUser<UserAction> _includeWithUser;
        private readonly IMapper _mapper;

        public UserActionsService(IUnitOfWork unitOfWork, IMapper mapper) 
        {
            _unitOfWork = unitOfWork;
            _userAction = _unitOfWork.RepositoryUserActions;
            _includeWithUser = _unitOfWork.IncludeUserActionWithUser;
            _mapper = mapper;
        }

        /// <summary>
        /// Create an user action async
        /// </summary>
        /// <param name="userAction"></param>
        /// <returns></returns>
        public async Task CreateAsync(UserAction userAction)
        {
            await _userAction.CreateAsync(userAction);
            await _unitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Delete an user action async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeleteAsync(int id)
        {
            var finUA = await _userAction.GetAsync(id);
            if (finUA == null)
            {
                return false;
            }
            else
            {
                await _userAction.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();
                return true;
            }    
        }

        /// <summary>
        /// Get all user action async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<UserActionsVM>> GetAllAsync()
        {
            var userActions = await _userAction.GetAsync();
            var includeUAs = new List<UserAction>();
            foreach (var userAction in userActions)
            {
                var includeUA = await _includeWithUser.GetGenericWithUserAsync(userAction.Id);
                includeUAs.Add(userAction);
            }
            return _mapper.Map<ICollection<UserActionsVM>>(includeUAs);
        }
    }
}
