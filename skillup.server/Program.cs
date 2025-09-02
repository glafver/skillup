using Microsoft.EntityFrameworkCore;
using skillup.server.Models;
using skillup.server.Services;
namespace skillup.server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Enable CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
            // MongoDB Configuration
            var mongoDBSettings = builder.Configuration
                            .GetSection("MongoDBSettings")
                            .Get<MongoDBSettings>();

            builder.Services.Configure<MongoDBSettings>(
                builder.Configuration.GetSection("MongoDBSettings"));

            builder.Services.AddDbContext<SkillupDbContext>(options =>
                options.UseMongoDB(mongoDBSettings.ConnectionString, mongoDBSettings.DatabaseName));

            builder.Services.AddScoped<IUserService, UserService>();

            // Swagger
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            var app = builder.Build();

            //Swagger in development
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //app.UseSwaggerUI();
            //}

            //app.UseHttpsRedirection();

            // Test backend to DB
            using (var scope = app.Services.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                userService.CreateUser(new Models.User
                {
                    Username = "test1",
                    Email = "test1@email.com",
                    Password = "password1233"
                });
            }

            // Use CORS before Authorization
            app.UseCors("AllowAll");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
