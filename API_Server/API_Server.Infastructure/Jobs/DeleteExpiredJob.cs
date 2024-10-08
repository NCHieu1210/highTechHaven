using API_Server.Infastructure.Data;
using Microsoft.EntityFrameworkCore;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Jobs
{
    public class DeleteExpiredJob : IJob
    {
        private readonly API_ServerContext _context;
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        public DeleteExpiredJob(API_ServerContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task Execute(IJobExecutionContext context)
        {
            await ExecuteJob(_context);
        }

        /// <summary>
        /// ExecuteJob when application startup
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static async Task ExecuteJob(API_ServerContext context)
        {
            var thresholdDate = DateTime.UtcNow.AddDays(-30);
            var productsToDelete = await context.Products
                .Where(p => p.ProductStatus.All(ps => ps.Name == Domain.Entities.Name.Deleted) &&
                       p.ProductStatus.Any(ps => ps.Name == Domain.Entities.Name.Deleted && ps.Date <= thresholdDate))
                .Include(p => p.ProductImages)
                .ToListAsync();

            var postsToDelete = await context.Posts
                .Where(p => p.PostStatus.All(ps => ps.Name == Domain.Entities.Name.Deleted) &&
                       p.PostStatus.Any(ps => ps.Name == Domain.Entities.Name.Deleted && ps.Date <= thresholdDate))
                .ToListAsync();

            if (productsToDelete.Any())
            {
                //Delete image product
                foreach (var product in productsToDelete)
                {
                    foreach (var productImage in product.ProductImages)
                    {
                        var segments = productImage.Image.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                        var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", segments[1], segments[2]);
                        await Task.Run(() => File.Delete(path));
                    }
                }
                //Delete product
                context.Products.RemoveRange(productsToDelete);
                await context.SaveChangesAsync();
            }

            if (postsToDelete.Any())
            {
                //Delete image post
                foreach (var post in postsToDelete)
                {
                    var segments = post.Thumbnail.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", segments[1], segments[2]);
                    await Task.Run(() => File.Delete(path));
                }
                //Delete product
                context.Posts.RemoveRange(postsToDelete);
                await context.SaveChangesAsync();
            }
        }
    }
}
