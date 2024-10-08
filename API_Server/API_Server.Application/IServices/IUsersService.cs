using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.IServices
{
    public interface IUsersService
    {
        /// <summary>
        /// Get all users async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<User>> GetAllAsync();

        /// <summary>
        /// Get a user by token asyc
        /// </summary>
        /// <returns></returns>
        public Task<User> GetByTokenAsync();

        /// <summary>
        /// Update an user by id with admin async 
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="userDTO"></param>=
        /// <returns></returns>
        public Task<User> UpdateUserByIdWithAdminAsync(string id, UserInAdminDTO userDTO);

        /// <summary>
        /// Update user detail async 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userDTO"></param>
        /// <returns></returns>
        public Task<User> UpdateUserAsync(UserDTO userDTO);

        /// <summary>
        /// Delete an user by id with admin async 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<User> DeleteUserByIdWithAdminAsync (string id);

        /// <summary>
        /// Get all delivery address async
        /// </summary>
        /// <returns></returns>
        public Task<ICollection<DeliveryAddress>> GetAllDeliveryAddressAsync();

        /// <summary>
        /// Get a delivery address by id async
        /// </summary>
        /// <returns></returns>
        public Task<DeliveryAddress> GetDeliveryAddressByIdAsync(int id);

        /// <summary>
        /// Get a delivery address by token async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<ICollection<DeliveryAddress>> GetDeliveryAddressByTokenAsync();


        /// <summary>
        /// Create a delivery address async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        public Task<DeliveryAddress> CreateDeliveryAddressAsync(DeliveryAddressDTO deliveryAddressDTO);

        /// <summary>
        /// Update a delivery address async
        /// </summary>
        /// <param name="id"></param>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        public Task<DeliveryAddress> UpdateDeliveryAddressAsync(int id, DeliveryAddressDTO deliveryAddressDTO);

        /// <summary>
        /// Delete a delivery address async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<DeliveryAddress> DeleteDeliveryAddressAsync(int id);

    }
}
