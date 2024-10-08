using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using API_Server.Infastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly API_ServerContext _context;

        public GenericRepository(API_ServerContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Add entity async
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<T> CreateAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            return entity;
        }

        /// <summary>
        /// Add range entities async
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<ICollection<T>> CreateRangeAsync(ICollection<T> entity)
        {
            await _context.Set<T>().AddRangeAsync(entity);
            return entity;
        }

        /// <summary>
        /// Delete an entity by id
        /// </summary>
        /// <param name="id"></param>
        public async Task DeleteAsync(object id)
        {
            var result = await _context.Set<T>().FindAsync(id);
            _context.Set<T>().Remove(result);
            /*
             * OR
             * EntityEntry entityEntry = _context.Entry<T>(entity);
            entityEntry.State= Microsoft.EntityFrameworkCore.EntityState.Deleted;
            */
        }

        /// <summary>
        /// Delete a range of entities by expression lambda async
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public async Task DeleteRangeAsync(Expression<Func<T, bool>> expression)
        {
            var entitiesToDelete = await _context.Set<T>().Where(expression).ToListAsync();
            if (entitiesToDelete.Any())
            {
                _context.Set<T>().RemoveRange(entitiesToDelete);
            }
        }

        /// <summary>
        /// Get all entities
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<T>> GetAsync()
        {
            var result = await _context.Set<T>().ToListAsync();
            return result;
        }

        /// <summary>
        ///  Get an entities by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<T> GetAsync(object id)
        {
            var result = await _context.Set<T>().FindAsync(id);
            return result ?? null;
        }

        /// <summary>
        /// Get an entity by expression lambda asyns
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public async Task<T> GetAsync(Expression<Func<T, bool>> expression)
        {
            var result = await _context.Set<T>().FirstOrDefaultAsync(expression);
            return result ?? null;
        }

        /// <summary>
        /// Get list entities by expression lambda asyns
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public async Task<ICollection<T>> GetICollectionAsync(Expression<Func<T, bool>> expression)
        {
            var result = await _context.Set<T>().Where(expression).ToListAsync();
            return result;
        }

        /// <summary>
        /// Get last id async
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetLastIdAsync()
        {
            var lastEntity = await _context.Set<T>()
                                       .OrderByDescending(e => EF.Property<int>(e, "Id"))
                                       .FirstOrDefaultAsync();
            if (lastEntity != null)
            {
                // Sử dụng Reflection để lấy giá trị của thuộc tính "Id"
                var idProperty = lastEntity.GetType().GetProperty("Id");
                if (idProperty != null)
                {
                    return (object)idProperty.GetValue(lastEntity);
                }
            }
            return null;
        }

        /// <summary>
        /// Update an entities
        /// </summary>
        /// <param name="id"></param>
        /// <param name="entity"></param>
        public async Task UpdateAsync(object id, T entity)
        {
            var result = await _context.Set<T>().FindAsync(id);
            if (result != null)
            {
                _context.Entry(result).CurrentValues.SetValues(entity);
            }
        }

        /// <summary>
        /// Update a range of entities
        /// </summary>
        /// <param name="entities"></param>
        public async Task UpdateRangeAsync(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                var entityId = _context.Entry(entity).Property("Id").CurrentValue;
                var existingEntity = await _context.Set<T>().FindAsync(entityId);
                if (existingEntity != null)
                {
                    _context.Entry(existingEntity).CurrentValues.SetValues(entity);
                }
            }
        }


        /// <summary>
        /// Get include entities by id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public async Task<T> IncludeEntity(object id, params Expression<Func<T, object>>[] includeProperties)
        {
            // Bắt đầu với đối tượng truy vấn cho kiểu T.
            IQueryable<T> query = _context.Set<T>();
            //Chỉ cần đọc dữ liệu mà không chỉnh sửa
            query = query.AsNoTracking();

            // Nếu có các thuộc tính include, thêm chúng vào truy vấn.
            if (includeProperties != null && includeProperties.Length > 0)
            {
                foreach (var includeProperty in includeProperties)
                {
                    query = query.Include(includeProperty);
                }
            }

            // Tìm EntityType của đối tượng T trong DbContext.
            var entityType = _context.Model.FindEntityType(typeof(T)) 
                ?? throw new InvalidOperationException($"Entity type '{typeof(T).Name}' not found in the current context.");

            // Tìm tên của thuộc tính khóa chính.
            var primaryKeyName = entityType.FindPrimaryKey().Properties.Select(p => p.Name).FirstOrDefault();
            if (string.IsNullOrEmpty(primaryKeyName))
            {
                throw new InvalidOperationException($"Primary key for entity type '{typeof(T).Name}' not found.");
            }

            // Thực hiện truy vấn để tìm entity theo ID.
            T result = await query.SingleOrDefaultAsync(entity => EF.Property<object>(entity, primaryKeyName).Equals(id));

            if (result == null)
            {
                throw new KeyNotFoundException($"Entity of type '{typeof(T).Name}' with ID '{id}' was not found.");
            }

            return result;
        }

        /// <summary>
        /// Get include collection entities by id
        /// </summary>
        /// <param name="ids"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<ICollection<T>> IncludeEntities(IEnumerable<object> ids, params Expression<Func<T, object>>[] includeProperties)
        {
            // Bắt đầu với đối tượng truy vấn cho kiểu T.
            IQueryable<T> query = _context.Set<T>();
            //Chỉ cần đọc dữ liệu mà không chỉnh sửa
            query = query.AsNoTracking();

            // Nếu có các thuộc tính include, thêm chúng vào truy vấn.
            if (includeProperties != null && includeProperties.Length > 0)
            {
                foreach (var includeProperty in includeProperties)
                {
                    query = query.Include(includeProperty);
                }
            }

            // Tìm EntityType của đối tượng T trong DbContext.
            var entityType = _context.Model.FindEntityType(typeof(T)) 
                ?? throw new InvalidOperationException($"Entity type '{typeof(T).Name}' not found in the current context.");

            // Tìm tên của thuộc tính khóa chính.
            var primaryKeyName = entityType.FindPrimaryKey().Properties.Select(p => p.Name).FirstOrDefault();
            if (string.IsNullOrEmpty(primaryKeyName))
            {
                throw new InvalidOperationException($"Primary key for entity type '{typeof(T).Name}' not found.");
            }

            // Truy vấn và trả về danh sách các thực thể.
            var results = await query.Where(entity => ids.Contains(EF.Property<object>(entity, primaryKeyName)))
                                     .ToListAsync();

            if (results == null || results.Count == 0)
            {
                throw new KeyNotFoundException($"No entities of type '{typeof(T).Name}' with the specified IDs were found.");
            }

            return results;
        }


    }
}
