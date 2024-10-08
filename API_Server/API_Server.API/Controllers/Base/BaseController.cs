using API_Server.Application.ApplicationModels.DTOs;
using API_Server.Application.ApplicationModels.ServiceModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Server.API.Controllers.Base
{
    [ApiController]
    public abstract class  BaseController : ControllerBase
    {
        /// <summary>
        /// Handle GET request async
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="getDataFunction"></param>
        /// <param name="validateResultFunction"></param>
        /// <returns></returns>
        protected async Task<IActionResult> HandleGetRequestAsync<T>(
            Func<Task<T>> getDataFunction,
            Func<T, bool> validateResultFunction)
        {
            try
            {
                var result = await getDataFunction();
                return validateResultFunction(result) ?
                    Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Get successfully!",
                        Data = result
                    }) :
                    NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "No data matching!",
                        Data = ""
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = string.Empty
                });
            }
        }

        /// <summary>
        /// Handle CREATE request async
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="CreateDataFunction"></param>
        /// <param name="validateResultFunction"></param>
        /// <returns></returns>
        protected async Task<IActionResult> HandleCreateRequestAsync<T>(
            Func<Task<T>> CreateDataFunction,
            Func<T, bool> validateResultFunction)
        {
            try
            {
                var result = await CreateDataFunction();
                return validateResultFunction(result) ?
                    Created("", new ApiResponse
                    {
                        Success = true,
                        Message = "Created successfully",
                        Data = result
                    })
                    : BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Created failed",
                        Data = string.Empty
                    });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("duplicate key") == true)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "The entity name already exists!",
                        Data = string.Empty
                    });
                }
                else
                {
                    return StatusCode(500, new ApiResponse
                    {
                        Success = false,
                        Message = "An error occurred while saving the entity!",
                        Data = string.Empty
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = string.Empty
                });
            }
        }

        /// <summary>
        /// Handle UPDATE request async
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="CreateDataFunction"></param>
        /// <param name="validateResultFunction"></param>
        /// <returns></returns>
        protected async Task<IActionResult> HandleUpdateRequestAsync<T>(
            Func<Task<T>> UpdateDataFunction,
            Func<T, bool> validateResultFunction)
        {
            try
            {
                var result = await UpdateDataFunction();
                return validateResultFunction(result)?
                    Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Updated successfully",
                        Data = result
                    })
                    : BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Updated failed",
                        Data = string.Empty
                    });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("duplicate key") == true)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "The entity name already exists!",
                        Data = string.Empty
                    });
                }
                else
                {
                    return StatusCode(500, new ApiResponse
                    {
                        Success = false,
                        Message = "An error occurred while saving the entity!",
                        Data = string.Empty
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = string.Empty
                });
            }
        }

        /// <summary>
        /// Handle DELETE request async
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="DeleteDataFunction"></param>
        /// <param name="validateResultFunction"></param>
        /// <returns></returns>
        protected async Task<IActionResult> HandleDeleteRequestAsync<T>(
            Func<Task<T>> DeleteDataFunction,
            Func<T, bool> validateResultFunction)
        {
            try
            {
                var result = await DeleteDataFunction();
                return validateResultFunction(result) ?
                    Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Deleted successful!",
                        Data = result
                    })
                    : NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "No data matching!",
                        Data = ""
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Handle RESTORE request async
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="RestoreDataFunction"></param>
        /// <param name="validateResultFunction"></param>
        /// <returns></returns>
        protected async Task<IActionResult> HandleRestoreRequestAsync<T>(
            Func<Task<T>> RestoreDataFunction,
            Func<T, bool> validateResultFunction)
        {
            try
            {
                var result = await RestoreDataFunction();
                return validateResultFunction(result) ?
                    Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Data restored successfully!",
                        Data = result
                    })
                    : NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "No data matching!",
                        Data = ""
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Data = string.Empty
                });
            }
        }
    }
}
