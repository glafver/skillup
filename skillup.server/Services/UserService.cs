using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using skillup.server.Models;

namespace skillup.server.Services
{
    public class UserService : IUserService
    {
        private readonly SkillupDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(SkillupDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteAsync(string id)
        {
            var user = await GetByIdAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> UpdateEmailAsync(string id, string newEmail)
        {
            var user = await GetByIdAsync(id);
            if (user == null) return false;

            user.Email = newEmail;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePasswordAsync(string id, string newPassword)
        {
            var user = await GetByIdAsync(id);
            if (user == null) return false;

            user.PasswordHash = _passwordHasher.HashPassword(user, newPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
