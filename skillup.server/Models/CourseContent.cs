using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace skillup.server.Models
{
    public class CourseLevel
    {
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("theoryText")]
        public string TheoryText { get; set; } = string.Empty;

        [BsonElement("isLocked")]
        public bool? IsLocked { get; set; }
    }

    public class CourseContent
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("slug")]
        public string Slug { get; set; } = string.Empty;

        [BsonElement("courseTitle")]
        public string CourseTitle { get; set; } = string.Empty;

        [BsonElement("levels")]
        public List<CourseLevel>? Levels { get; set; } 

        [BsonElement("theoryText")]
        public string? TheoryText { get; set; }         
    }
}
