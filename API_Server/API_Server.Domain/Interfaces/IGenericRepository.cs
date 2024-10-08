using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        #region Async Methods

        /// <summary>
        /// Get all entities asyns
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<T>> GetAsync();

        /// <summary>
        /// Get an entities by Id asyns
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Task<T> GetAsync(object id);

        /// <summary>
        /// Get an entity by expression lambda asyns
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public Task<T> GetAsync(Expression<Func<T, bool>> expression);

        /// <summary>
        /// Get list entities by expression lambda asyns
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public Task<ICollection<T>> GetICollectionAsync(Expression<Func<T, bool>> expression);

        /// <summary>
        /// Get last id async
        /// </summary>
        /// <returns></returns>
        public Task<object> GetLastIdAsync();

        /// <summary>
        ///Add new entity asynss
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Task<T> CreateAsync(T entity);

        /// <summary>
        /// Add range entities async
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Task<ICollection<T>> CreateRangeAsync(ICollection<T> entity);

        /// <summary>
        ///Update an entity asyns
        /// </summary>
        /// <param name="id"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Task UpdateAsync(object id, T entity);

        /// <summary>
        /// Update a range of entities
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        public Task UpdateRangeAsync(IEnumerable<T> entities);

        /// <summary>
        /// Delete an entity by id async
        /// </summary>
        /// <param name="entity"></param>
        public Task DeleteAsync(object id);

        /// <summary>
        /// Delete a range of entities by expression lambda async
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public Task DeleteRangeAsync(Expression<Func<T, bool>> expression);
        /// <summary>
        /// Get include entities by id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public Task<T> IncludeEntity(object id, params Expression<Func<T, object>>[] includeProperties);

        /// <summary>
        /// Get include collection entities by id
        /// </summary>
        /// <param name="ids"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public Task<ICollection<T>> IncludeEntities(IEnumerable<object> ids, params Expression<Func<T, object>>[] includeProperties);

        #endregion
    }
}
