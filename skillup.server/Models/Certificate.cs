using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

public class Certificate
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } = string.Empty;

    [BsonElement("userid")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("courseslug")]
    public string CourseSlug { get; set; } = string.Empty;

    [BsonElement("firstname")]
    public string Firstname { get; set; } = string.Empty;

    [BsonElement("lastname")]
    public string Lastname { get; set; } = string.Empty;

    [BsonElement("coursetitle")]
    public string CourseTitle { get; set; } = string.Empty;

    [BsonElement("issuedat")]
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
}
