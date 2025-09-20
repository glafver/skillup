using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace skillup.server.Models
{
    //Använd LevelCode och ActiveCourseStatus enums för att representera och updatera nivåer och statusar
    public enum LevelCode { Beginner, Advanced, Expert }
    public enum ActiveCourseStatus { Active, Completed }

    [MongoDB.EntityFrameworkCore.Collection("ActiveCourse")]
    public class ActiveCourse
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        public string CourseSlug { get; set; } = string.Empty;

        // progress
        public LevelCode CurrentLevel { get; set; } = LevelCode.Beginner;
        public ActiveCourseStatus Status { get; set; } = ActiveCourseStatus.Active;

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; } = DateTime.UtcNow;
    }
}
