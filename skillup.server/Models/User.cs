namespace skillup.server.Models
{
    using System.ComponentModel.DataAnnotations;
    using MongoDB.Bson;
    public class User
    {
        public ObjectId Id { get; set; }
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}