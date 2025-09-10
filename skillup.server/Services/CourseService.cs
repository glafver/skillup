using MongoDB.Bson;
using Microsoft.EntityFrameworkCore;
using skillup.server.Models;

namespace skillup.server.Services
{
    public class CourseService : ICourseService
    {
        private readonly SkillupDbContext _dbContext;

        public CourseService(SkillupDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Course>> GetAllCourseAsync()
            => await _dbContext.Courses.ToListAsync();

        public async Task<Course?> GetCourseByIdAsync(string id)
        {
            return await _dbContext.Courses.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Course> AddCourseAsync(Course course)
        {
            course.Title = course.Title?.Trim();
            course.Description = course.Description?.Trim();

            try
            {
                _dbContext.Courses.Add(course);
                await _dbContext.SaveChangesAsync();
                return course;
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate key") == true)
            {
                throw new InvalidOperationException($"A course with the title '{course.Title}' already exists.");
            }
        }

        public async Task UpdateCourseAsync(Course course)
        {
            _dbContext.Courses.Update(course);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteCourseAsync(string id)
        {
            var course = await GetCourseByIdAsync(id);
            if (course is null) return;
            _dbContext.Courses.Remove(course);
            await _dbContext.SaveChangesAsync();
        }
    }
}
