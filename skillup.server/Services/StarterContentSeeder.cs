using MongoDB.Bson;
using skillup.server.Models;

namespace skillup.server.Services
{
    /// <summary>
    /// Loads the sample courses, content and quizzes (see <see cref="SampleData"/>) into
    /// MongoDB. Shared by the admin seed endpoint and the startup bootstrapping, so an
    /// empty database is filled automatically without an admin having to click anything.
    /// </summary>
    public class StarterContentSeeder
    {
        private readonly ICourseService _courses;
        private readonly CourseContentService _contents;
        private readonly IQuizService _quizzes;

        public StarterContentSeeder(
            ICourseService courses,
            CourseContentService contents,
            IQuizService quizzes)
        {
            _courses = courses;
            _contents = contents;
            _quizzes = quizzes;
        }

        public async Task<SeedResult> SeedAsync(bool force = false)
        {
            var existingCourses = await _courses.GetAllCourseAsync();
            var bySlug = existingCourses
                .GroupBy(c => c.Slug, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(g => g.Key, g => g.First(), StringComparer.OrdinalIgnoreCase);

            var result = new SeedResult();

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
                    result.CoursesUpdated++;
                    continue;
                }

                course.Id = ObjectId.GenerateNewId().ToString();
                await _courses.AddCourseAsync(course);
                result.CoursesCreated++;
            }

            foreach (var content in SampleData.Contents())
            {
                var existingContent = await _contents.GetBySlugAsync(content.Slug);
                if (existingContent != null)
                {
                    if (!force) continue;
                    await _contents.UpsertAsync(content);
                    result.ContentsUpdated++;
                    continue;
                }

                await _contents.UpsertAsync(content);
                result.ContentsCreated++;
            }

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

                    result.QuizzesUpdated++;
                    continue;
                }

                quiz.Id = ObjectId.GenerateNewId();
                await _quizzes.AddQuizAsync(quiz);
                result.QuizzesCreated++;
            }

            return result;
        }
    }

    public class SeedResult
    {
        public int CoursesCreated { get; set; }
        public int CoursesUpdated { get; set; }
        public int ContentsCreated { get; set; }
        public int ContentsUpdated { get; set; }
        public int QuizzesCreated { get; set; }
        public int QuizzesUpdated { get; set; }

        public string Message =>
            $"Starter content: {CoursesCreated} courses created / {CoursesUpdated} updated, " +
            $"{ContentsCreated} contents created / {ContentsUpdated} updated, " +
            $"{QuizzesCreated} quizzes created / {QuizzesUpdated} updated.";
    }
}
