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

        // Get quizzes by slug and level
        public async Task<List<Quiz>> GetQuizzesBySlugAndLevelAsync(string slug, string level)
        {
            return await _context.Set<Quiz>()
                                 .Where(q => q.Slug == slug && q.Level == level)
                                 .ToListAsync();
        }

        // Get a single quiz by ID
        public async Task<Quiz?> GetQuizByIdAsync(string id)
        {
            if (!MongoDB.Bson.ObjectId.TryParse(id, out var oid)) return null;
            return await _context.Set<Quiz>().FirstOrDefaultAsync(q => q.Id == oid);
        }

        // Add a new quiz
        public async Task<Quiz> AddQuizAsync(Quiz quiz)
        {
            _context.Set<Quiz>().Add(quiz);
            await _context.SaveChangesAsync();
            return quiz;
        }

        // Update an existing quiz
        public async Task UpdateQuizAsync(Quiz quiz)
        {
            _context.Set<Quiz>().Update(quiz);
            await _context.SaveChangesAsync();
        }

        // Delete a quiz by ID
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
