using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Infastructure.Data;
using API_Server.Infastructure.Identity.IdentityModels;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly GenericRepository<ApplicationUser> _genericRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        /// <summary>
        /// Injection API_ServerContext and IMapper. Use ApplicationUser and GenericRepository<ApplicationUser> to do CRUD
        /// </summary>
        /// <param name="context"></param>
        /// <param name="mapper"></param>
        public UsersRepository(API_ServerContext context, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _genericRepository = new GenericRepository<ApplicationUser>(context);
            _userManager = userManager;
            _mapper = mapper;
        }

        /// <summary>
        /// Create an user async
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<User> CreateAsync(User entity)
        {
            var applicationUser = _mapper.Map<ApplicationUser>(entity);
            var createdApplicationUser = await _genericRepository.CreateAsync(applicationUser);
            return _mapper.Map<User>(createdApplicationUser);
        }

        public async Task<ICollection<User>> CreateRangeAsync(ICollection<User> entity)
        {
            var applicationUser = _mapper.Map<ICollection<ApplicationUser>>(entity);

            var createdApplicationUser = await _genericRepository.CreateRangeAsync(applicationUser);
            return _mapper.Map<ICollection<User>>(createdApplicationUser);
        }

        /// <summary>
        /// Delete an user async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task DeleteAsync(object id)
        {
            await _genericRepository.DeleteAsync(id);
        }

        /// <summary>
        /// Delete a range of users by expression lambda async
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public async Task DeleteRangeAsync(Expression<Func<User, bool>> expression)
        {
            var applicationExpression = _mapper.Map<Expression<Func<ApplicationUser, bool>>>(expression);
            await _genericRepository.DeleteRangeAsync(applicationExpression);
        }

        /// <summary>
        /// Get all users async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<User>> GetAsync()
        {
            var applicationUsers = await _genericRepository.GetAsync();
            var usersWithRoles = new List<User>();

            foreach (var applicationUser in applicationUsers)
            {
                var roles = await _userManager.GetRolesAsync(applicationUser);
                var user = _mapper.Map<User>(applicationUser);
                user.Roles = roles;
                usersWithRoles.Add(user);
            }

            return usersWithRoles;
        }

        /// <summary>
        /// Get an user by id async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<User> GetAsync(object id)
        {
            var applicationUser = await _genericRepository.GetAsync(id);
            return _mapper.Map<User>(applicationUser);
        }

        /// <summary>
        /// Get an user by expression lambda async
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public async Task<User> GetAsync(Expression<Func<User, bool>> expression)
        {
            var applicationExpression = _mapper.Map<Expression<Func<ApplicationUser, bool>>>(expression);
            var applicationUsers = await _genericRepository.GetAsync(applicationExpression);
            return _mapper.Map<User>(applicationUsers);
        }

        public async Task<ICollection<User>> GetICollectionAsync(Expression<Func<User, bool>> expression)
        {
            var applicationExpression = _mapper.Map<Expression<Func<ApplicationUser, bool>>>(expression);
            var applicationUsers = await _genericRepository.GetICollectionAsync(applicationExpression);
            return _mapper.Map<ICollection<User>>(applicationUsers);
        }

        /// <summary>
        /// Get last id async
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetLastIdAsync()
        {
            var lastEntity = await _genericRepository.GetLastIdAsync();
            return lastEntity != null ? EF.Property<int>(lastEntity, "Id") : 0;
        }

        /// <summary>
        /// Include Entity
        /// </summary>
        /// <param name="id"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public async Task<User> IncludeEntity(object id, params Expression<Func<User, object>>[] includeProperties)
        {
            var applicationIncludeProperties = _mapper.Map<Expression<Func<ApplicationUser, object>>[]>(includeProperties);
            var applicationUser = await _genericRepository.IncludeEntity(id, applicationIncludeProperties);
            return _mapper.Map<User>(applicationUser);
        }

        /// <summary>
        /// Include Entity
        /// </summary>
        /// <param name="id"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public async Task<ICollection<User>> IncludeEntities(IEnumerable<object> ids, params Expression<Func<User, object>>[] includeProperties)
        {
            var applicationIncludeProperties = _mapper.Map<Expression<Func<ApplicationUser, object>>[]>(includeProperties);
            var applicationUser = await _genericRepository.IncludeEntities(ids, applicationIncludeProperties);
            return _mapper.Map<ICollection<User>>(applicationUser);
        }

        /// <summary>
        /// Update an user by id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task UpdateAsync(object id, User entity)
        {
            var applicationUser = await _genericRepository.GetAsync(id);
            _mapper.Map(entity, applicationUser);
            await _genericRepository.UpdateAsync(id, applicationUser);
        }

        /// <summary>
        ///  Update a range of entities
        /// </summary>
        /// <param name="users"></param>
        /// <returns></returns>
        public async Task UpdateRangeAsync(IEnumerable<User> entity)
        {
            var applicationUser = _mapper.Map<IEnumerable<ApplicationUser>>(entity);
            await _genericRepository.UpdateRangeAsync(applicationUser);
        }

        /// <summary>
        /// Get roles by user Id
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public async Task<ICollection<string>> GetRolesByUserID(string userID)
        {
            var applicationUser = await _genericRepository.GetAsync(userID) ?? throw new Exception("User does not exist!");
            var roles = await _userManager.GetRolesAsync(applicationUser);
            return roles;
        }

        /// <summary>
        /// Get user by role name
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public async Task<ICollection<User>> GetUserByRoleName(ICollection<string> roleNames)
        {
            var applicationUser = new List<ApplicationUser>();
            foreach (var roleName in roleNames)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);
                applicationUser.AddRange(usersInRole);
            }
            var user = _mapper.Map<ICollection<User>>(applicationUser.Distinct().ToList());
            return user;
        }
    }
}
