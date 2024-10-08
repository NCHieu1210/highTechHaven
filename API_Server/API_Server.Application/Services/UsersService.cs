using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using API_Server.Application.ApplicationModels.ViewModels;
using API_Server.Application.Helpers;
using API_Server.Application.IServices;
using API_Server.Domain.Entities;
using API_Server.Domain.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Services
{
    public class UsersService : IUsersService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUsersRepository _users;
        private readonly IHelpersService _helpersService;
        private readonly IGenericRepository<DeliveryAddress> _deliveryAddress;
        private readonly IIncludeWithUser<DeliveryAddress> _includeDA;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAuthRepository _authRP;

        public UsersService(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor, IHelpersService helpersService,
            IMapper mapper, IAuthRepository authRP)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _users = _unitOfWork.RepositoryUsers;
            _deliveryAddress = _unitOfWork.RepositoryDeliveryAddresses;
            _includeDA = _unitOfWork.IncludeDeliveryAddressWithUser;
            _helpersService = helpersService;
            _httpContextAccessor = httpContextAccessor;
            _authRP = authRP;
        }

        /// <summary>
        /// Get all users async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<User>> GetAllAsync()
        {
            return await _users.GetAsync();
        }

        /// <summary>
        /// Get user by token asyc
        /// </summary>
        /// <returns></returns>
        public async Task<User> GetByTokenAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            if (userId == null)
            {
                return null;
            }
            return await _users.GetAsync(userId);
        }


        /// <summary>
        /// Update an user by id with admin async
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="userDTO"></param>=
        /// <returns></returns>
        public async Task<User> UpdateUserByIdWithAdminAsync(string id, UserInAdminDTO userDTO)
        {
            if (!string.IsNullOrEmpty(userDTO.UrlAvatar) && userDTO.FileAvatar != null)
            {
                throw new Exception("Input data is incorrect!");
            }

            //Check if user is exitst
            var existingUser = await _users.GetAsync(id);
            if (existingUser == null || existingUser.Id != id)
            {
                throw new Exception("No data maching!");
            }
            string pathImageOld = existingUser.Avatar;

            var user = _mapper.Map<User>(userDTO);
            var setSlug = $"{userDTO.FirstName}-{userDTO.LastName}-{Guid.NewGuid()}";

            //Assign values from findP( user in database) to the user( map from userDTO)
            user.Id = existingUser.Id;
            user.UserName = existingUser.UserName;
            user.Email = existingUser.Email;
            user.Slug = _helpersService.GenerateSlug(setSlug);
            user.NumberPosts = existingUser.NumberPosts;
            user.CreateDate = existingUser.CreateDate;


            if (!(await _authRP.UpdateUserRolesAsync(user)))
            {
                return null;
            }

            if (pathImageOld == "/images/users/defaultAvatar.png" && userDTO.UrlAvatar?.Contains("/images/users/defaultAvatar.png") == true)
            {
                user.Avatar = pathImageOld;
            }
            //Check if url avatar is null or empty
            else if (string.IsNullOrEmpty(userDTO.UrlAvatar))
            {
                string path = _helpersService.GetImageName(userDTO.FileAvatar, "users", user.Slug) ?? throw new Exception("The uploaded file is not a valid image.");
                user.Avatar = path;
            }
            else
            {
                string pathExtension = _helpersService.GetFileExtension(userDTO.UrlAvatar);
                user.Avatar = $"/images/users/{user.Slug}{pathExtension}";
            }

            //Upload database
            await _users.UpdateAsync(id, user);
            await _unitOfWork.SaveChangesAsync();

            //Delete file image old and upload file image new old
            //Check if url logo is null or empty
            if (string.IsNullOrEmpty(userDTO.UrlAvatar) && userDTO.FileAvatar != null)
            {
                if (!string.IsNullOrEmpty(pathImageOld) && pathImageOld != "/images/users/defaultAvatar.png")
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
                await _helpersService.UploadImageAsync(userDTO.FileAvatar, user.Avatar);
            }
            //Check if url logo is'nt null or empty
            else if (!string.IsNullOrEmpty(userDTO.UrlAvatar) && userDTO.FileAvatar == null)
            {
                if (pathImageOld != "/images/users/defaultAvatar.png")
                {
                    await _helpersService.RenameImageAsync(userDTO.UrlAvatar, user.Avatar);
                }
            }
            else
            {
                if (!string.IsNullOrEmpty(pathImageOld) && pathImageOld != "/images/users/defaultAvatar.png")
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
            }

            return user;
        }

        /// <summary>
        /// Update user detail async 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        /// <exception cref="InvalidImageException"></exception>
        public async Task<User> UpdateUserAsync(UserDTO userDTO)
        {
            if (!string.IsNullOrEmpty(userDTO.UrlAvatar) && userDTO.FileAvatar != null)
            {
                throw new Exception("Input data is incorrect!");
            }

            var id = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;

            //Check if user is exitst
            var existingUser = await _users.GetAsync(id);
            if (existingUser == null || existingUser.Id != id)
            {
                throw new Exception("No data maching!");
            }
            string pathImageOld = existingUser.Avatar;

            var user = _mapper.Map<User>(userDTO);
            var setSlug = $"{userDTO.FirstName}-{userDTO.LastName}-{Guid.NewGuid()}";

            //Assign values from findP( user in database) to the user( map from userDTO)
            user.Id = existingUser.Id;
            user.UserName = existingUser.UserName;
            user.Email = existingUser.Email;
            user.Slug = _helpersService.GenerateSlug(setSlug);
            user.NumberPosts = existingUser.NumberPosts;
            user.CreateDate = existingUser.CreateDate;
            user.Roles = existingUser.Roles;

            if (pathImageOld == "/images/users/defaultAvatar.png" && userDTO.UrlAvatar?.Contains("/images/users/defaultAvatar.png") == true)
            {
                user.Avatar = pathImageOld;
            }
            //Check if url avatar is null or empty
            else if (string.IsNullOrEmpty(userDTO.UrlAvatar))
            {
                string path = _helpersService.GetImageName(userDTO.FileAvatar, "users", user.Slug) ?? throw new Exception("The uploaded file is not a valid image.");
                user.Avatar = path;
            }
            else
            {
                string pathExtension = _helpersService.GetFileExtension(userDTO.UrlAvatar);
                user.Avatar = $"/images/users/{user.Slug}{pathExtension}";
            }

            //Upload database
            await _users.UpdateAsync(id, user);
            await _unitOfWork.SaveChangesAsync();

            //Delete file image old and upload file image new old
            //Check if url logo is null or empty
            if (string.IsNullOrEmpty(userDTO.UrlAvatar) && userDTO.FileAvatar != null)
            {
                if (!string.IsNullOrEmpty(pathImageOld) && pathImageOld != "/images/users/defaultAvatar.png")
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
                await _helpersService.UploadImageAsync(userDTO.FileAvatar, user.Avatar);
            }
            //Check if url logo is'nt null or empty
            else if (!string.IsNullOrEmpty(userDTO.UrlAvatar) && userDTO.FileAvatar == null)
            {
                if (pathImageOld != "/images/users/defaultAvatar.png")
                {
                    await _helpersService.RenameImageAsync(userDTO.UrlAvatar, user.Avatar);
                }
            }
            else
            {
                if (!string.IsNullOrEmpty(pathImageOld) && pathImageOld != "/images/users/defaultAvatar.png")
                {
                    await _helpersService.DeleteImageAsync(pathImageOld);
                }
            }
            return user;
        }

        /// <summary>
        /// Delete an user by id with admin async 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<User> DeleteUserByIdWithAdminAsync(string id)
        {
            var existingUser = await _users.GetAsync(id);
            if (existingUser == null)
            {
                return null;
            }
            else
            {

                await _users.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                //Delete file image
                if (!string.IsNullOrEmpty(existingUser.Avatar) && existingUser.Avatar != "/images/users/defaultAvatar.png")
                {
                    await _helpersService.DeleteImageAsync(existingUser.Avatar);
                }

                return existingUser;
            }
        }

        /// <summary>
        /// Get all delivery address async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<DeliveryAddress>> GetAllDeliveryAddressAsync()
        {
            var deliveryAddresses = await _deliveryAddress.GetAsync();
            var includes = new List<DeliveryAddress>();
            foreach (var deliveryAddress in deliveryAddresses)
            {
                var include = await _includeDA.GetGenericWithUserAsync(deliveryAddress.Id);
                if (include != null)
                {
                    includes.Add(deliveryAddress);
                }
            }
            return includes;
        }

        /// <summary>
        /// Get a delivery address by id async
        /// </summary>
        /// <returns></returns>
        public async Task<DeliveryAddress> GetDeliveryAddressByIdAsync(int id)
        {
            var deliveryAddress = await _deliveryAddress.GetAsync(id);
            var includeDA = await _includeDA.GetGenericWithUserAsync(id);
            return includeDA;
        }

        /// <summary>
        /// Get a delivery address by token async
        /// </summary>
        /// <returns></returns>
        public async Task<ICollection<DeliveryAddress>> GetDeliveryAddressByTokenAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var deliveryAddresses = await _deliveryAddress.GetICollectionAsync(da => da.UserID == userId);
            var includes = new List<DeliveryAddress>();
            foreach (var deliveryAddress in deliveryAddresses)
            {
                var include = await _includeDA.GetGenericWithUserAsync(deliveryAddress.Id);
                if (include != null)
                {
                    includes.Add(deliveryAddress);
                }
            }
            return includes;
        }

        /// <summary>
        /// Create a delivery address async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        public async Task<DeliveryAddress> CreateDeliveryAddressAsync(DeliveryAddressDTO deliveryAddressDTO)
        {
            var UserID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var deliveryAddress = _mapper.Map<DeliveryAddress>(deliveryAddressDTO);
            deliveryAddress.UserID = UserID;
            var result = await _deliveryAddress.CreateAsync(deliveryAddress);
            await _unitOfWork.SaveChangesAsync();
            return result;
        }


        /// <summary>
        /// Update a delivery address async
        /// </summary>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        public async Task<DeliveryAddress> UpdateDeliveryAddressAsync(int id, DeliveryAddressDTO deliveryAddressDTO)
        {
            var UserID = _httpContextAccessor.HttpContext?.User?.FindFirst("UserID")?.Value;
            var existingData = await _deliveryAddress.GetAsync(id);
            if (existingData == null)
            {
                throw new Exception("No data maching!");
            }
            var deliveryAddress = _mapper.Map<DeliveryAddress>(deliveryAddressDTO);
            deliveryAddress.Id = id;
            deliveryAddress.UserID = UserID;

            await _deliveryAddress.UpdateAsync(id, deliveryAddress);
            await _unitOfWork.SaveChangesAsync();

            return existingData;
        }

        /// <summary>
        /// Delete a delivery address async
        /// </summary>
        /// <param name="id"></param>
        /// <param name="deliveryAddressDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<DeliveryAddress> DeleteDeliveryAddressAsync(int id)
        {
            var existingData = await _deliveryAddress.GetAsync(id);
            if (existingData == null)
            {
                throw new Exception("No data maching!");
            }

            await _deliveryAddress.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return existingData;
        }
    }
}
