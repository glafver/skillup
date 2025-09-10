using skillup.server.Models;

using MongoDB.Bson;
using MongoDB.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
namespace skillup.server.Models
{
    [Collection("Courses")]
    public class Course
    {
        
        public ObjectId Id { get; set; } = default!;

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = default!;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = default!;

        [Required(ErrorMessage = "ImageUrl is required")]
        public string ImageUrl { get; set; } = default!;
    }
}
