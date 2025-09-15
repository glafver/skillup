namespace skillup.server.Models
{
    using System.ComponentModel.DataAnnotations;
    using MongoDB.Bson;
    public class User
    {
        
        public ObjectId Id { get; set; }
        [Required(ErrorMessage = "Firstname is required")]
        public string Firstname { get; set; } = string.Empty;
        [Required(ErrorMessage = "Lastname is required")]
        public string Lastname { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required")]
        public string PasswordHash { get; set; } = string.Empty;
    }
}