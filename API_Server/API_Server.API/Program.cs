using API_Server.API.SignalRHubs;
using API_Server.API.Middlewares;
using API_Server.API.SignalRSender;
using API_Server.Application.Helpers;
using API_Server.Application.ISender;
using API_Server.Application.IServices;
using API_Server.Application.Services;
using API_Server.Domain.IExternalServices;
using API_Server.Domain.Interfaces;
using API_Server.Infastructure.ConfigureSettings;
using API_Server.Infastructure.Data;
using API_Server.Infastructure.ExternalServices;
using API_Server.Infastructure.Identity;
using API_Server.Infastructure.Identity.IdentityModels;
using API_Server.Infastructure.Jobs;
using API_Server.Infastructure.JwtService;
using API_Server.Infastructure.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Quartz;
using Quartz.Impl.AdoJobStore.Common;
using System.Text;
using Azure.Identity;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using API_Server.API;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình Key Vault
var keyVaultUri = new Uri("https://hth-keyvault.vault.azure.net/");
builder.Configuration.AddAzureKeyVault(
    keyVaultUri,
    new DefaultAzureCredential());

// Configure MailSettings
builder.Services.Configure<API_Server.Infastructure.ConfigureSettings.MailSettings>(builder.Configuration.GetSection("MailSettings"));
// Configure Google SignIn settings
builder.Services.Configure<SignInGoogleSettings>(builder.Configuration.GetSection("SignInGoogleSettings"));
// Configure payment with VnPay settings
builder.Services.Configure<VnPaySettings>(builder.Configuration.GetSection("VnPaySettings"));

//Connect Database
builder.Services.AddDbContext<API_ServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("APIServerContext") 
    ?? throw new InvalidOperationException("Connection string 'APIServerContext' not found.")));
//END Connect Database

//Add AutoMapper
builder.Services.AddAutoMapper(
    typeof(ApplicationMapper).Assembly,  // Profile for Application layer
    typeof(AppUserMapper).Assembly      // Profile for Infrastructure layer
); 
//END Add AutoMapper

//Add Reposotory Pattern and UnitOfWork Pattern
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<ITokensService, TokensService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
//END Add Reposotory Pattern and UnitOfWork Pattern

//Add Servicers
builder.Services.AddScoped<IHelpersService, HelpersService>();
builder.Services.AddScoped<ISuppliersService, SuppliersService>();
builder.Services.AddScoped<ICategoriesService, CategoriesService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IProductsService, ProductsService>();
builder.Services.AddScoped<IProductExpansionsService, ProductExpansionsService>();
builder.Services.AddScoped<IFavouritesService, FavouritesService>();
builder.Services.AddScoped<IReviewsService, ReviewsService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrdersService, OrdersService>();
builder.Services.AddScoped<IOrderUpdatesService, OrderUpdatesService>();
builder.Services.AddScoped<IBlogsService, BlogsService>();
builder.Services.AddScoped<IPostsService, PostsService>();
builder.Services.AddScoped<ICommentsService, CommentsService>();
builder.Services.AddScoped<ILikedService, LikedService>();
builder.Services.AddScoped<ITrashService, TrashService>();
builder.Services.AddScoped<IUserActionsService, UserActionsService>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<INotificationsService, NotificationsService>();
//END Add Servicers

//Add Hubs
builder.Services.AddScoped<INotificationSender, NotificationSender>();
builder.Services.AddScoped<IOrderSender, OrderSender>();
builder.Services.AddScoped<NotificationsHub>();
builder.Services.AddScoped<OrdersHub>();

//End Add Hubs

//Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddEntityFrameworkStores<API_ServerContext>()
        .AddDefaultTokenProviders();
//END Add Identity


//Add AddAuthentication
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddCookie()
.AddJwtBearer(option => {
        option.SaveToken = true;
        option.RequireHttpsMetadata = false;
        option.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
            ValidAudience = builder.Configuration["JWT:ValidAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
        };

        // Cấu hình SignalR sử dụng Token JWT
        option.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // Nếu kết nối SignalR
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationsHub"))
                {
                    // Lấy Token từ Query string
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
})
.AddGoogle(options =>
 {
     var googleAuthNSection = builder.Configuration.GetSection("SignInGoogleSettings");
     options.ClientId = googleAuthNSection["ClientId"];
     options.ClientSecret = googleAuthNSection["ClientSecret"];
     options.SaveTokens = true;
 });
//END Add AddAuthentication*/

//Add IHttpContextAccessor 
builder.Services.AddHttpContextAccessor();
//End add IHttpContextAccessor


// Quartz.NET configuration
builder.Services.AddQuartz(q =>
{
    var jobKey = new JobKey("DeleteExpiredProductsJob");

    q.AddJob<DeleteExpiredJob>(opts => opts.WithIdentity(jobKey));

    q.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity("DeleteExpiredProductsJob-trigger")
        .WithCronSchedule("0 0 0 * * ?")); // Chạy hàng ngày lúc nửa đêm
});

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
//END Quartz.NET configuration

//Add CORS
builder.Services.AddCors(
    option => option.AddDefaultPolicy(policy => policy.AllowAnyOrigin()
                                                      .AllowAnyHeader()
                                                      .AllowAnyMethod())
    );

// Add SignalR
builder.Services.AddSignalR();
builder.Services.AddSingleton<IUserIdProvider, NameUserIdProvider>(); // Đăng ký NameUserIdProvider
//END Add SignalR

//Configure to remove null-valued attributes
builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});


//ADD Serves static files
builder.Services.AddControllersWithViews();
//ADD Serves static files

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.UseUserActionTracking(); // Sử dụng middleware theo dõi hoạt động

// Cấu hình SignalR
app.MapHub<NotificationsHub>("/notificationsHub"); // Đường dẫn để client kết nối
app.MapHub<OrdersHub>("/ordersHub"); // Đường dẫn để client kết nối

app.MapControllers();

// Run the job to delete expired products on application startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<API_ServerContext>();
    await DeleteExpiredJob.ExecuteJob(context);
}

app.Run();
