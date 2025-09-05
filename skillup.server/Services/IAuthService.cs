using skillup.server.Models;

namespace skillup.server.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(string firstname, string lastname, string email, string password);
        Task<string?> LoginAsync(string email, string password);
    }
}
