using Microsoft.Data.SqlClient;
using GymSport.Connection;
using Serilog;
using Payment.Persistence.Persist;
using GymSport.Repository;
using Microsoft.AspNetCore.Http.Features;
using GymSport.Models;
using System.Reflection;
using Payment.Application.Interface;
using Payment.Api.Services;
using Payment.Application.Features.Commands;
using Payment.Service.Momo.Config;

namespace GymSport
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
     
    
            // Thêm các dịch vụ vào container
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddTransient<SqlConnectionFactory>();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo()
                {
                    Version = "v1",
                    Title ="GymSport",
                    Description = "Sample .NET GymSport ",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact()
                    {
                        Name ="HuynhDuc code",
                        Url = new Uri("https://localhost:44326/home")
                    }
                });
                var xmlFileName = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var path = Path.Combine(AppContext.BaseDirectory, xmlFileName);
                options.IncludeXmlComments(path);
            });

            builder.Services.Configure<MomoConfig>(
             builder.Configuration.GetSection(MomoConfig.ConfigName));
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<ISqlService, SqlService>();
            builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
            builder.Services.AddScoped<IConnectionService, ConnectionService>();

            builder.Services.AddMediatR(r =>
            {
                r.RegisterServicesFromAssembly(typeof(CreateMerchant).Assembly);
            });
            //builder.Services.AddHangfire(configuration => configuration
            //    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
            //    .UseSimpleAssemblyNameTypeSerializer()
            //    .UseRecommendedSerializerSettings()
            //    .UseSqlServerStorage(builder.Configuration.GetConnectionString("Database"),
            //    new Hangfire.SqlServer.SqlServerStorageOptions()
            //    {
            //        //TODO: Change hangfire sql server option
            //    }));
            //builder.Services.AddHangfireServer();



            builder.Services.AddTransient<SqlConnectionFactory>();
            builder.Services.AddScoped<UserRepository>();
            builder.Services.AddScoped<ProductCategoryRepository>();
            builder.Services.AddScoped<ProductsRepository>();
            builder.Services.AddScoped<SizeRepository>();
            builder.Services.AddScoped<ColorRepository>();
            builder.Services.AddScoped<ProductSizesRepository>();
            builder.Services.AddScoped<ProductColorsRepository>();
            builder.Services.AddScoped<ImageRepository>();
            builder.Services.AddScoped<InventoryRepository>();
            builder.Services.AddScoped<OrderRepository>();
            builder.Services.AddScoped<PaymentMethodRepository>();
            builder.Services.AddScoped<PaymentRepository>();
            builder.Services.AddTransient<ISenderEmail, EmailSender>();
            builder.Services.AddScoped<OrderDetailsRepository>();
            builder.Services.AddScoped<PaymentdetailRepository>();
            builder.Services.AddScoped<WishListRepository>();
            builder.Services.AddScoped<FeedBackRepository>();
            // Cấu hình CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                    });
            });



            // Thiết lập Serilog
            builder.Host.UseSerilog((context, services, configuration) => configuration
                .ReadFrom.Configuration(context.Configuration)
                .ReadFrom.Services(services));


            var app = builder.Build();

            // Cấu hình pipeline HTTP
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAllOrigins");
            app.UseAuthorization();
            app.MapControllers();
     
            app.UseRouting();
            app.UseStaticFiles();
            app.Run();
        }
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // Giới hạn 10MB
            });
        }




    }
}
