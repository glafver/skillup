using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using skillup.server.Models;
using skillup.server.Services;

namespace skillup.server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ICourseService _courses;
        private readonly CourseContentService _contents;
        private readonly IQuizService _quizzes;
        private readonly IUserService _users;

        public AdminController(
            ICourseService courses,
            CourseContentService contents,
            IQuizService quizzes,
            IUserService users)
        {
            _courses = courses;
            _contents = contents;
            _quizzes = quizzes;
            _users = users;
        }

        private static string Slugify(string value)
        {
            var slug = new string(value.Trim().ToLowerInvariant()
                .Select(c => (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') ? c : '-')
                .ToArray());

            while (slug.Contains("--")) slug = slug.Replace("--", "-");
            return slug.Trim('-');
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _users.GetAllAsync();
            return Ok(users.Select(u => new
            {
                id = u.Id.ToString(),
                u.Firstname,
                u.Lastname,
                u.Email,
                u.Avatar,
                Role = string.IsNullOrWhiteSpace(u.Role) ? "User" : u.Role
            }));
        }

        // ---------- courses ----------

        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourse([FromBody] Course course)
        {
            if (string.IsNullOrWhiteSpace(course.Title))
                return BadRequest(new { message = "Title is required." });

            if (string.IsNullOrWhiteSpace(course.Slug))
                course.Slug = Slugify(course.Title);

            if (string.IsNullOrWhiteSpace(course.Slug))
                return BadRequest(new { message = "Could not build a slug from the title." });

            course.Id = ObjectId.GenerateNewId().ToString();
            if (course.LevelCount <= 0) course.LevelCount = 3;

            try
            {
                var created = await _courses.AddCourseAsync(course);
                return Ok(created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("courses/{id}")]
        public async Task<IActionResult> UpdateCourse(string id, [FromBody] Course course)
        {
            var existing = await _courses.GetCourseByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Title = course.Title;
            existing.Description = course.Description;
            existing.Image = course.Image;
            existing.Category = course.Category;
            if (course.LevelCount > 0) existing.LevelCount = course.LevelCount;
            if (!string.IsNullOrWhiteSpace(course.Slug)) existing.Slug = Slugify(course.Slug);

            await _courses.UpdateCourseAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("courses/{id}")]
        public async Task<IActionResult> DeleteCourse(string id)
        {
            var existing = await _courses.GetCourseByIdAsync(id);
            if (existing == null) return NotFound();

            await _courses.DeleteCourseAsync(id);

            if (!string.IsNullOrWhiteSpace(existing.Slug))
            {
                await _contents.DeleteBySlugAsync(existing.Slug);
                await _quizzes.DeleteBySlugAsync(existing.Slug);
            }

            return Ok(new { message = "Course, its content and quizzes were deleted." });
        }

        // ---------- course content ----------

        [HttpPut("courses/{slug}/content")]
        public async Task<IActionResult> UpsertContent(string slug, [FromBody] CourseContent content)
        {
            if (string.IsNullOrWhiteSpace(slug))
                return BadRequest(new { message = "Slug is required." });

            content.Slug = slug;
            await _contents.UpsertAsync(content);
            return Ok(content);
        }

        [HttpDelete("courses/{slug}/content")]
        public async Task<IActionResult> DeleteContent(string slug)
        {
            var removed = await _contents.DeleteBySlugAsync(slug);
            return removed ? Ok(new { message = "Content deleted." }) : NotFound();
        }

        // ---------- quizzes ----------

        [HttpPost("quizzes")]
        public async Task<IActionResult> CreateQuiz([FromBody] Quiz quiz)
        {
            if (string.IsNullOrWhiteSpace(quiz.Slug) || string.IsNullOrWhiteSpace(quiz.Level))
                return BadRequest(new { message = "Slug and level are required." });

            quiz.Id = ObjectId.GenerateNewId();
            var created = await _quizzes.AddQuizAsync(quiz);
            return Ok(created);
        }

        [HttpPut("quizzes/{id}")]
        public async Task<IActionResult> UpdateQuiz(string id, [FromBody] Quiz quiz)
        {
            var existing = await _quizzes.GetQuizByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Level = quiz.Level;
            existing.Questions = quiz.Questions;
            await _quizzes.UpdateQuizAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("quizzes/{id}")]
        public async Task<IActionResult> DeleteQuiz(string id)
        {
            var existing = await _quizzes.GetQuizByIdAsync(id);
            if (existing == null) return NotFound();

            await _quizzes.DeleteQuizAsync(id);
            return Ok(new { message = "Quiz deleted." });
        }

        // ---------- starter content ----------

        [HttpPost("seed")]
        public async Task<IActionResult> Seed([FromQuery] bool force = false)
        {
            var existingCourses = await _courses.GetAllCourseAsync();
            var bySlug = existingCourses
                .GroupBy(c => c.Slug, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(g => g.Key, g => g.First(), StringComparer.OrdinalIgnoreCase);

            var coursesCreated = 0;
            var coursesUpdated = 0;
            foreach (var course in SampleData.Courses())
            {
                if (bySlug.TryGetValue(course.Slug, out var current))
                {
                    if (!force) continue;

                    current.Title = course.Title;
                    current.Description = course.Description;
                    current.Image = course.Image;
                    current.Category = course.Category;
                    current.LevelCount = course.LevelCount;
                    await _courses.UpdateCourseAsync(current);
                    coursesUpdated++;
                    continue;
                }

                course.Id = ObjectId.GenerateNewId().ToString();
                await _courses.AddCourseAsync(course);
                coursesCreated++;
            }

            var contentsCreated = 0;
            var contentsUpdated = 0;
            foreach (var content in SampleData.Contents())
            {
                var existingContent = await _contents.GetBySlugAsync(content.Slug);
                if (existingContent != null)
                {
                    if (!force) continue;
                    await _contents.UpsertAsync(content);
                    contentsUpdated++;
                    continue;
                }

                await _contents.UpsertAsync(content);
                contentsCreated++;
            }

            var quizzesCreated = 0;
            var quizzesUpdated = 0;
            foreach (var quiz in SampleData.Quizzes())
            {
                var already = await _quizzes.GetQuizzesBySlugAndLevelAsync(quiz.Slug, quiz.Level);
                if (already.Count > 0)
                {
                    if (!force) continue;

                    var target = already[0];
                    target.Questions = quiz.Questions;
                    await _quizzes.UpdateQuizAsync(target);

                    // Remove accidental duplicates, keeping only the first one.
                    for (var i = 1; i < already.Count; i++)
                    {
                        await _quizzes.DeleteQuizAsync(already[i].Id.ToString());
                    }

                    quizzesUpdated++;
                    continue;
                }

                quiz.Id = ObjectId.GenerateNewId();
                await _quizzes.AddQuizAsync(quiz);
                quizzesCreated++;
            }

            return Ok(new
            {
                message =
                    $"Starter content: {coursesCreated} courses created / {coursesUpdated} updated, " +
                    $"{contentsCreated} contents created / {contentsUpdated} updated, " +
                    $"{quizzesCreated} quizzes created / {quizzesUpdated} updated.",
                coursesCreated,
                coursesUpdated,
                contentsCreated,
                contentsUpdated,
                quizzesCreated,
                quizzesUpdated
            });
        }
    }
}
