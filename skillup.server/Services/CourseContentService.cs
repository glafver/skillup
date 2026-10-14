using Microsoft.Extensions.Options;
using MongoDB.Bson;
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

        public async Task UpsertAsync(CourseContent content)
        {
            var existing = await GetBySlugAsync(content.Slug);
            if (existing == null)
            {
                content.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
                await _content.InsertOneAsync(content);
                return;
            }

            content.Id = existing.Id;
            await _content.ReplaceOneAsync(c => c.Slug == content.Slug, content);
        }

        public async Task<bool> DeleteBySlugAsync(string slug)
        {
            var result = await _content.DeleteOneAsync(c => c.Slug == slug);
            return result.DeletedCount > 0;
        }

        /// <summary>
        /// Runs a trivial command against the database. Used by the health endpoint and
        /// by the scheduled keep-alive that stops a free Atlas cluster from pausing.
        /// </summary>
        public async Task<bool> PingAsync()
        {
            try
            {
                await _content.Database.RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1));
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
