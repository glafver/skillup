using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace skillup.server.Models
{
    [BsonIgnoreExtraElements]
    public class Quiz
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        [Required]
        [BsonElement("level")]
        public string Level { get; set; } = default!;

        [Required]
        [BsonElement("questions")]
        public List<QuizQuestion> Questions { get; set; } = new();
    }

    public class QuizQuestion
    {
        [Required]
        [BsonElement("questionText")]
        public string QuestionText { get; set; } = default!;

        [Required]
        [BsonElement("options")]
        public List<string> Options { get; set; } = new();

        [Required]
        [BsonElement("answer")]
        public string Answer { get; set; } = default!;
    }
}
