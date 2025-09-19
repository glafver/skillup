using Microsoft.Extensions.Options;
using MongoDB.Driver;
using skillup.server.Models;

namespace skillup.server.Services
{
    public class CourseContentService
    {
        private readonly IMongoCollection<CourseContent> _content;

        public CourseContentService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _content = db.GetCollection<CourseContent>("CourseContent"); // match Atlas collection
        }

        public async Task<List<CourseContent>> GetAllAsync() =>
            await _content.Find(_ => true).ToListAsync();

        public async Task<CourseContent?> GetBySlugAsync(string slug) =>
            await _content.Find(c => c.Slug == slug).FirstOrDefaultAsync();
    }
}
