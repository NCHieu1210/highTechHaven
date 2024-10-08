using API_Server.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;
using System.Linq.Expressions;

namespace API_Server.Application.Helpers
{
    public class HelpersService : IHelpersService
    {
        private readonly string[] _permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };

        /// <summary>
        /// Upload a file image
        /// </summary>
        /// <param name="fileImage"></param>
        /// <param name="nameFileImage"></param>
        /// <returns></returns>
        public string GetImageName(IFormFile fileImage, string storage, string nameFileImage)
        {
            //Check if file name is valid
            if (fileImage == null || fileImage.Length == 0)
            {
                return string.Empty;
            }

            //Get file extension for fileImage
            var fileExtension = Path.GetExtension(fileImage.FileName);

            //Check if the file is an image file
            if (string.IsNullOrEmpty(fileExtension) || !_permittedExtensions.Contains(fileExtension))
            {
                return null;
            }

            return $"/images/{storage}/{ nameFileImage + fileExtension}";
        }

        /// <summary>
        /// Upload file imgae async
        /// </summary>
        /// <param name="fileImage"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public async Task UploadImageAsync(IFormFile fileImage, string fileName)
        {
            if (!string.IsNullOrEmpty(fileName))
            {
                // Separate string path components
                var segments = fileName.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", segments[1], segments[2]);
                {
                    using var stream = File.Create(path);
                    await fileImage.CopyToAsync(stream);
                }
            }
        }

        /// <summary>
        /// Upload collection file imgae async
        /// </summary>
        /// <param name="fileImages"></param>
        /// <param name="fileNames"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public async Task UploadCollectionImagesAsync(ICollection<IFormFile> fileImages, ICollection<string> fileNames)
        {
            if (fileImages.Count > 0 && fileNames.Count > 0 && fileImages.Count == fileNames.Count)
            {
                var fileImageNamePairs = fileImages.Zip(fileNames, (image, name) => new { Image = image, Name = name });
                foreach (var pair in fileImageNamePairs)
                {
                    var fileName = pair.Name;
                    var fileImage = pair.Image;

                    // Separate string path components
                    var segments = fileName.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", segments[1], segments[2]);

                    using var stream = File.Create(path);
                    await fileImage.CopyToAsync(stream);
                }
            }
            else
            {
                throw new ArgumentException("The number of images and filenames must match and not be zero!");
            }
        }

        /// <summary>
        /// Rename file image async
        /// </summary>
        /// <param name="currentFileName"></param>
        /// <param name="newFileName"></param>
        /// <returns></returns>
        /// <exception cref="FileNotFoundException"></exception>
        public async Task RenameImageAsync (string currentFileName, string newFileName)
        {
            if (!string.IsNullOrEmpty(currentFileName) && !string.IsNullOrEmpty(newFileName))
            {
                // Separate string path components for current and new file names
                var currentSegments = currentFileName.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                var newSegments = newFileName.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

                // Construct the full paths for current and new file names
                var currentPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", currentSegments[1], currentSegments[2]);
                var newPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", newSegments[1], newSegments[2]);

                // Ensure the current file exists before renaming
                if (File.Exists(currentPath))
                {
                    File.Move(currentPath, newPath);
                }
                else
                {
                    throw new FileNotFoundException("The file to rename does not exist.");
                }
            }
        }

        /// <summary>
        /// Delete a image async
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public async Task DeleteImageAsync(string fileName)
        {
            // Separate string path components
            var segments = fileName.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", segments[1], segments[2]);
            await Task.Run(() => File.Delete(path));
        }

        /// <summary>
        /// Delete collection images async
        /// </summary>
        /// <param name="fileNames"></param>
        /// <returns></returns>
        public async Task DeleteCollectionImagesAsync(ICollection<string> fileNames)
        {
            foreach (var fileName in fileNames)
            {
                // Separate string path components
                var segments = fileName.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", segments[1], segments[2]);

                if (File.Exists(path))
                {
                    await Task.Run(() => File.Delete(path));
                }
            }
        }

        /// <summary>
        /// Get file extension
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public string GetFileExtension(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                throw new ArgumentException("File path cannot be null or empty!", nameof(filePath));
            }

            return Path.GetExtension(filePath);
        }


        /// <summary>
        /// Get initials uppercase
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public string GetInitialsUppercase(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return string.Empty;
            }
            input = input.Replace("đ", "d").Replace("Đ", "D");

            // Tách chuỗi thành các từ
            string[] words = input.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            if (words.Length == 1 )
            {
                var normalizedString = words[0].Normalize(NormalizationForm.FormD).ToUpper();
                var stringBuilder = new StringBuilder();

                foreach (var c in normalizedString)
                {
                    var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                    if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                    {
                        stringBuilder.Append(c);
                    }
                }
                return stringBuilder.ToString().Normalize(NormalizationForm.FormC); ;
            }    
            // Lấy chữ cái đầu của mỗi từ và viết hoa toàn bộ
            string initials = string.Concat(words.Select(word => char.ToUpper(word[0])));

            return initials;
        }

        /// <summary>
        /// Capitalize the first letter of the entire text
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public string CapitalizeTheFirst(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            var words = input.Split(' ');

            for (int i = 0; i < words.Length; i++)
            {
                if (words[i].Length > 0)
                {
                    words[i] = char.ToUpper(words[i][0]) + words[i].Substring(1);
                }
            }

            return string.Join(' ', words);
        }

        /// <summary>
        /// Generate slug
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public string GenerateSlug(string name)
        {
            // Thay thế các ký tự đặc biệt cụ thể trước khi chuẩn hóa
            name = name.Replace("đ", "d").Replace("Đ", "D");

            // Normalize the string to FormD to separate characters and diacritics
            string normalizedString = name.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder();

            // Remove diacritics
            foreach (char c in normalizedString)
            {
                UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            // Convert to lowercase and remove invalid characters
            string cleanName = stringBuilder.ToString().Normalize(NormalizationForm.FormC);
            cleanName = Regex.Replace(cleanName.ToLower(), @"[^a-z0-9\s-]", "");

            // Replace multiple spaces with a single space, trim, and replace spaces with hyphens
            cleanName = Regex.Replace(cleanName, @"\s+", " ").Trim();
            cleanName = cleanName.Replace(" ", "-");

            // Limit the length to 45 characters
            /*if (cleanName.Length > 45)
            {
                cleanName = cleanName.Substring(0, 45).Trim('-');
            }*/

            return cleanName;
        }

        /// <summary>
        /// Get IP address
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public string GetIpAddress(HttpContext context)
        {
            var ipAddress = string.Empty;
            try
            {
                var remoteIpAddress = context.Connection.RemoteIpAddress;

                if (remoteIpAddress != null)
                {
                    if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                    {
                        remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                            .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                    }

                    if (remoteIpAddress != null) ipAddress = remoteIpAddress.ToString();

                    return ipAddress;
                }
            }
            catch (Exception ex)
            {
                return "Invalid IP:" + ex.Message;
            }

            return "127.0.0.1";
        }


    }
}
