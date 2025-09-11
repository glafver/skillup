using skillup.server.Models;
using Microsoft.EntityFrameworkCore;

namespace skillup.server.Services
{
    public class QuizService : IQuizService
    {
        private readonly SkillupDbContext _context;

        public QuizService(SkillupDbContext context)
        {
            _context = context;
        }

        public async Task<List<Quiz>> GetQuizzesByLevelAsync(string level)
        {
            return await _context.Set<Quiz>()
                                 .Where(q => q.Level == level)
                                 .ToListAsync();
        }

        public async Task<Quiz?> GetQuizByIdAsync(string id)
        {
            if (!MongoDB.Bson.ObjectId.TryParse(id, out var oid)) return null;
            return await _context.Set<Quiz>().FirstOrDefaultAsync(q => q.Id == oid);
        }

        public async Task<Quiz> AddQuizAsync(Quiz quiz)
        {
            _context.Set<Quiz>().Add(quiz);
            await _context.SaveChangesAsync();
            return quiz;
        }

        public async Task UpdateQuizAsync(Quiz quiz)
        {
            _context.Set<Quiz>().Update(quiz);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteQuizAsync(string id)
        {
            var quiz = await GetQuizByIdAsync(id);
            if (quiz != null)
            {
                _context.Set<Quiz>().Remove(quiz);
                await _context.SaveChangesAsync();
            }
        }
    }
}
