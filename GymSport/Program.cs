using Microsoft.Data.SqlClient;
using GymSport.Connection;
using Serilog;
using GymSport.Repository;
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
            builder.Services.AddSwaggerGen();
            builder.Services.AddTransient<SqlConnectionFactory>();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddTransient<SqlConnectionFactory>();
            builder.Services.AddScoped<UserRepository>();
            builder.Services.AddScoped<ProductCategoryRepository>();
            builder.Services.AddScoped<ProductsRepository>();
            builder.Services.AddScoped<SizeRepository>();
            builder.Services.AddScoped<ColorRepository>();
            builder.Services.AddScoped<ProductSizesRepository>();



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
    }
}
