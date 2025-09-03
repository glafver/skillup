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

        public async Task<User?> RegisterAsync(string firstname, string lastname, string email, string password)
        {
            var existing = await _userService.GetByEmailAsync(email);
            if (existing != null) return null;

            var user = new User
            {
                Firstname = firstname,
                Lastname = lastname,
                Email = email
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
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:DurationInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
