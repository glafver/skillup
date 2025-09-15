using skillup.server.Models;

namespace skillup.server.Services
{
    public interface IQuizService
    {
        Task<List<Quiz>> GetQuizzesByLevelAsync(string level);
        Task<Quiz?> GetQuizByIdAsync(string id);
        Task<Quiz> AddQuizAsync(Quiz quiz);
        Task UpdateQuizAsync(Quiz quiz);
        Task DeleteQuizAsync(string id);
    }
}
