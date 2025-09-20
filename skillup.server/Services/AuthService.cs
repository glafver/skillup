using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using skillup.server.Models;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace skillup.server.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;

        public AuthService(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<User?> RegisterAsync(string firstname, string lastname, string email, string password, string avatar)
        {
            var existing = await _userService.GetByEmailAsync(email);
            if (existing != null) return null;

            var user = new User
            {
                Firstname = firstname,
                Lastname = lastname,
                Email = email,
                Avatar = avatar
            };
            
            user.PasswordHash = _passwordHasher.HashPassword(user, password);
            await _userService.CreateAsync(user);
            return user;
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null) return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
                return null;

            return GenerateJwtToken(user);
        }
        
        private string GenerateJwtToken(User user)
        {
            var keyString = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key is missing in configuration");

            var issuer = _configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException("Jwt:Issuer is missing in configuration");

            var audience = _configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException("Jwt:Audience is missing in configuration");

            var durationString = _configuration["Jwt:DurationInMinutes"]
                ?? throw new InvalidOperationException("Jwt:DurationInMinutes is missing in configuration");

            if (!double.TryParse(durationString, out var durationMinutes))
                throw new InvalidOperationException("Jwt:DurationInMinutes must be a number");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(durationMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
