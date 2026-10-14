using Microsoft.EntityFrameworkCore;
using skillup.server.Converters;
using skillup.server.Models;
using skillup.server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;

namespace skillup.server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new ObjectIdJsonConverter());
                });

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

            if (string.IsNullOrWhiteSpace(mongoDBSettings.ConnectionString))
            {
                throw new InvalidOperationException(
                    "MongoDBSettings:ConnectionString is not configured. Set the " +
                    "MongoDBSettings__ConnectionString environment variable (see skillup.server/example.env).");
            }

            builder.Services.Configure<MongoDBSettings>(
                builder.Configuration.GetSection("MongoDBSettings"));

            builder.Services.AddDbContext<SkillupDbContext>(options =>
                options.UseMongoDB(mongoDBSettings.ConnectionString, mongoDBSettings.DatabaseName));

            builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ICourseService, CourseService>();
            builder.Services.AddSingleton<CourseContentService>();
            builder.Services.AddScoped<IQuizService, QuizService>();
            builder.Services.AddScoped<ICertificateService, CertificateService>();

            //JWT
            var key = builder.Configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(key) || Encoding.UTF8.GetByteCount(key) < 32)
            {
                throw new InvalidOperationException(
                    "Jwt:Key is missing or shorter than 32 characters. Set the " +
                    "Jwt__Key environment variable (see skillup.server/example.env).");
            }
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                    NameClaimType = JwtRegisteredClaimNames.Sub // "sub" i token till .NameIdentifier
                };
            });


            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            //Swagger in development
            if (app.Environment.IsDevelopment())
            {
               app.UseSwagger();
            app.UseSwaggerUI();
            }

            // Account bootstrapping. Configured with the Admin__Email/Admin__Password and
            // Demo__Email/Demo__Password environment variables.
            async Task EnsureAccountAsync(string? email, string? password, string role, string firstname, string lastname)
            {
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password)) return;

                try
                {
                    using var scope = app.Services.CreateScope();
                    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

                    var existing = await userService.GetByEmailAsync(email);
                    if (existing == null)
                    {
                        var created = new User
                        {
                            Firstname = firstname,
                            Lastname = lastname,
                            Email = email,
                            Avatar = "avatar1.png",
                            Role = role
                        };
                        created.PasswordHash = passwordHasher.HashPassword(created, password);
                        await userService.CreateAsync(created);
                        app.Logger.LogInformation("{Role} account {Email} created", role, email);
                    }
                    else if (role == "Admin" && existing.Role != "Admin")
                    {
                        existing.Role = "Admin";
                        await userService.UpdateAsync(existing);
                        app.Logger.LogInformation("Account {Email} promoted to Admin", email);
                    }
                }
                catch (Exception ex)
                {
                    // Do not stop the application: the database can also be configured
                    // through a new revision. The account is created on the next start.
                    app.Logger.LogError(ex,
                        "Could not create the {Role} account {Email}. " +
                        "Check MongoDBSettings__ConnectionString.", role, email);
                }
            }

            await EnsureAccountAsync(
                builder.Configuration["Admin:Email"], builder.Configuration["Admin:Password"],
                "Admin", "SkillUp", "Admin");

            await EnsureAccountAsync(
                builder.Configuration["Demo:Email"], builder.Configuration["Demo:Password"],
                "User", "Demo", "User");

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
            
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            await app.RunAsync();
        }
    }
}
