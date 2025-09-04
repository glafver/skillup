using Microsoft.EntityFrameworkCore;
using skillup.server.Models;
using skillup.server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
                    policy.WithOrigins("http://localhost:5173") // React app URL
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
            // MongoDB Config
            var mongoDBSettings = builder.Configuration
                .GetSection("MongoDBSettings")
                .Get<MongoDBSettings>() 
                ?? throw new InvalidOperationException("MongoDBSettings not found in configuration");

            builder.Services.Configure<MongoDBSettings>(
                builder.Configuration.GetSection("MongoDBSettings"));

            builder.Services.AddDbContext<SkillupDbContext>(options =>
                options.UseMongoDB(mongoDBSettings.ConnectionString, mongoDBSettings.DatabaseName));

            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAuthService, AuthService>();

            //JWT
            var key = builder.Configuration["Jwt:Key"]
                    ?? throw new InvalidOperationException("Jwt:Key is missing in configuration");
            var issuer = builder.Configuration["Jwt:Issuer"]
                    ?? throw new InvalidOperationException("Jwt:Issuer is missing in configuration");
            var audience = builder.Configuration["Jwt:Audience"]
                    ?? throw new InvalidOperationException("Jwt:Audience is missing in configuration");

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });


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

            // Testar till Mogno Atlas
            /*
            using (var scope = app.Services.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                userService.CreateUser(new Models.User
                {
                    Username = "test1",
                    Email = "test1@email.com",
                    Password = "password1233"
                });
            }*/

            // Use CORS before Authorization
            app.UseCors("AllowAll");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
