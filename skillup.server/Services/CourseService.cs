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
            course.Title = course.Title.Trim();
            course.Description = course.Description.Trim();

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

        public async Task<bool> DeleteCourseAsync(string id)
        {
            var course = await GetCourseByIdAsync(id);
            if (course is null) return false;

            _dbContext.Courses.Remove(course);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Lägg till kurs till användarens aktiva kurser
        public async Task<ActiveCourse> AddActiveCourseAsync(string userId, string courseSlug)
        {
            var existing = await _dbContext.ActiveCourses
                .FirstOrDefaultAsync(x => x.UserId == userId && x.CourseSlug == courseSlug);

            if (existing != null) return existing;

            var activeCourse = new ActiveCourse
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserId = userId,
                CourseSlug = courseSlug,
                StartedAt = DateTime.UtcNow,
                CurrentLevel = LevelCode.Beginner,
                Status = ActiveCourseStatus.Active
            };

            _dbContext.ActiveCourses.Add(activeCourse);
            await _dbContext.SaveChangesAsync();
            return activeCourse;
        }

        public async Task<bool> IsCourseActiveAsync(string userId, string courseSlug)
        {
            return await _dbContext.ActiveCourses
                .AnyAsync(x => x.UserId == userId && x.CourseSlug == courseSlug);
        }
    }
}
