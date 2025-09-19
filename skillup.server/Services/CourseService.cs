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

        public async Task<ActiveCourse> AdvanceActiveCourseAsync(string userId, string courseSlug)
        {
            var activeCourse = await _dbContext.ActiveCourses
                .FirstOrDefaultAsync(x => x.UserId == userId && x.CourseSlug == courseSlug);

            if (activeCourse == null)
                throw new Exception("Active course not found.");

            var levels = Enum.GetValues(typeof(LevelCode)).Cast<LevelCode>().ToList();
            var currentIndex = levels.IndexOf(activeCourse.CurrentLevel);

            if (currentIndex == -1)
                throw new Exception("Invalid current level.");

            if (currentIndex == levels.Count - 1)
            {
                activeCourse.Status = ActiveCourseStatus.Completed;
                activeCourse.CompletedAt = DateTime.UtcNow;
            }
            else
            {
                activeCourse.CurrentLevel = levels[currentIndex + 1];
            }

            _dbContext.ActiveCourses.Update(activeCourse);
            await _dbContext.SaveChangesAsync();

            return activeCourse;
        }

        public async Task<object?> GetCourseStatusAsync(string userId, string courseSlug)
        {
            var activeCourse = await _dbContext.ActiveCourses
                .FirstOrDefaultAsync(x => x.UserId == userId && x.CourseSlug == courseSlug);

            if (activeCourse == null) return null;

            return new
            {
                status = activeCourse.Status.ToString(),          
                level = activeCourse.CurrentLevel.ToString(),     
                isCompleted = activeCourse.CompletedAt != null   
            };
        }

        public async Task<List<ActiveCourseDto>> GetUserActiveCoursesWithDetailsAsync(string userId)
        {
            var active = await _dbContext.ActiveCourses
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.StartedAt)
                .ToListAsync();

            if (active.Count == 0) return new List<ActiveCourseDto>();

            var slugs = active.Select(a => a.CourseSlug).Distinct().ToList();

            var courses = await _dbContext.Courses
                .Where(c => slugs.Contains(c.Slug))
                .ToListAsync();

            var bySlug = courses.ToDictionary(c => c.Slug, c => c);

            var result = new List<ActiveCourseDto>(active.Count);
            foreach (var a in active)
            {
                bySlug.TryGetValue(a.CourseSlug, out var course);

                result.Add(new ActiveCourseDto
                {
                    Id           = a.Id,
                    CourseSlug   = a.CourseSlug,
                    StartedAt    = a.StartedAt,
                    CurrentLevel = a.CurrentLevel.ToString(), 
                    Status       = a.Status.ToString(),
                    Title        = course?.Title ?? "",
                    Description  = course?.Description ?? "",
                    Image        = course?.Image ?? ""
                });
            }

            return result;
        }
    }

    public class ActiveCourseDto
    {
        public string Id { get; set; } = string.Empty;
        public string CourseSlug { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; }
        public string CurrentLevel { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
    }

}
