using MongoDB.Bson;
using skillup.server.Models;

namespace skillup.server.Services
{


    public interface IUserService
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(string id);
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user);
        Task DeleteAsync(string id);
        Task<bool> UpdateEmailAsync(string id, string newEmail);
        Task<bool> UpdatePasswordAsync(string id, string newPassword);
    }
}