using System.Text.Json;
using System.Text.Json.Serialization;
using MongoDB.Bson;

namespace skillup.server.Converters
{
    /// <summary>
    /// Serialises MongoDB ObjectId values as their 24 character hex string instead of
    /// the default object shape ({ timestamp, creationTime }), so clients can use the
    /// id directly.
    /// </summary>
    public class ObjectIdJsonConverter : JsonConverter<ObjectId>
    {
        public override ObjectId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetString();
            return string.IsNullOrWhiteSpace(value) ? ObjectId.GenerateNewId() : ObjectId.Parse(value);
        }

        public override void Write(Utf8JsonWriter writer, ObjectId value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString());
        }
    }
}
