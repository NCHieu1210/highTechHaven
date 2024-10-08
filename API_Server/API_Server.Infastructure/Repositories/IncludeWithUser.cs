using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Infastructure.Data;
using API_Server.Infastructure.Identity.IdentityModels;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Repositories
{
    public class IncludeWithUser<T> : IIncludeWithUser<T> where T : class
    {
        private readonly API_ServerContext _context;
        private readonly IMapper _mapper;

        public IncludeWithUser(API_ServerContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Get entity that include user async
        /// </summary>
        /// <param name="entityId"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<T> GetGenericWithUserAsync(int entityId)
        {
            var entity = await _context.Set<T>().FindAsync(entityId);
            if (entity == null)
            {    
                return null;
            }

            //Get property
            var userIDProperty = entity.GetType().GetProperty("UserID") ?? throw new InvalidOperationException("UserID property not found on entity.");

            //Get value
            var userIDValue = userIDProperty.GetValue(entity) ?? throw new InvalidOperationException("UserID value is null.");
            var applicationUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userIDValue.ToString()) ?? throw new InvalidOperationException("User not found.");

            //Map ApplicationUser entity to the User
            var user = _mapper.Map<User>(applicationUser);

            // Đặt thuộc tính User vào entity
            var userEntityProperty = entity.GetType().GetProperty("User") ?? throw new InvalidOperationException("User property not found on entity.");
            userEntityProperty.SetValue(entity, user);

            return entity;
        }

        /// <summary>
        /// Get entities that include user async
        /// </summary>
        /// <param name="entityIds"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<ICollection<T>> GetGenericWithUserAsync(ICollection<int> entityIds)
        {
            // Lấy các thực thể mà ID nằm trong entityIds
            var entities = await _context.Set<T>()
                .AsNoTracking() // Chỉ đọc dữ liệu mà không theo dõi
                .Where(e => entityIds.Contains(EF.Property<int>(e, "Id"))) // Sử dụng EF.Property để lấy Id
                .ToListAsync();

            // Tạo danh sách UserID để lấy người dùng
            var userIds = entities.Select(e =>
            {
                var userIDProperty = e.GetType().GetProperty("UserID")
                    ?? throw new InvalidOperationException("UserID property not found on entity.");

                var userIDValue = userIDProperty.GetValue(e)?.ToString();
                if (string.IsNullOrEmpty(userIDValue))
                    throw new InvalidOperationException("UserID value is null or empty.");

                return userIDValue;
            }).Distinct().ToList(); // Lấy danh sách UserID duy nhất

            // Lấy tất cả người dùng một lần
            var applicationUsers = await _context.Users
                .AsNoTracking()
                .Where(u => userIds.Contains(u.Id))
                .ToListAsync();

            // Tạo từ điển để ánh xạ UserID với User
            var userDictionary = applicationUsers.ToDictionary(u => u.Id, u => _mapper.Map<User>(u));

            // Gán người dùng vào các Entity
            foreach (var entity in entities)
            {
                var userIDProperty = entity.GetType().GetProperty("UserID") ?? throw new InvalidOperationException("UserID property not found on entity.");
                var userIDValue = userIDProperty.GetValue(entity)?.ToString();

                if (!string.IsNullOrEmpty(userIDValue) && userDictionary.TryGetValue(userIDValue, out var user))
                {
                    var userEntityProperty = entity.GetType().GetProperty("User") ?? throw new InvalidOperationException("User property not found on entity.");
                    userEntityProperty.SetValue(entity, user);
                }
            }

            return entities;
        }
    }
}
