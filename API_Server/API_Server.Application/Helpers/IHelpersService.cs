using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Application.Helpers
{
    public interface IHelpersService
    {
        /// <summary>
        /// Get name with file image async
        /// </summary>
        /// <param name="fileImage"></param>
        /// <param name="nameFileImage"></param>
        /// <returns></returns>
        public string GetImageName(IFormFile fileImage, string storage, string nameFileImage);

        /// <summary>
        /// Upload a file imgae async
        /// </summary>
        /// <param name="fileImage"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public Task UploadImageAsync(IFormFile fileImage, string fileName);

        /// <summary>
        /// Upload collection file imgae async
        /// </summary>
        /// <param name="fileImages"></param>
        /// <param name="folderName"></param>
        /// <returns></returns>
        public Task UploadCollectionImagesAsync(ICollection<IFormFile> fileImages, ICollection<string> fileNames);


        /// <summary>
        /// Rename file image async
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        public Task RenameImageAsync(string currentFileName, string newFileName);

        /// <summary>
        /// Delete a image async
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public Task DeleteImageAsync(string fileName);

        /// <summary>
        /// Delete collection images async
        /// </summary>
        /// <param name="fileNames"></param>
        /// <returns></returns>
        public Task DeleteCollectionImagesAsync(ICollection<string> fileNames);

        /// <summary>
        /// Get file extension
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public string GetFileExtension(string filePath);

        /// <summary>
        /// Get initials uppercase
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public string GetInitialsUppercase(string input);

        /// <summary>
        /// Capitalize the first letter of the entire text
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public string CapitalizeTheFirst(string input);

        /// <summary>
        /// Generate Slug
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public string GenerateSlug(string name);

        /// <summary>
        /// Get IP address
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public string GetIpAddress(HttpContext context);
    }
}
