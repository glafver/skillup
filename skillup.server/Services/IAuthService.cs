using skillup.server.Models;

namespace skillup.server.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(string firstname, string lastname, string email, string password, string avatar);
        Task<string?> LoginAsync(string email, string password);
    }
}
