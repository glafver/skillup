using MongoDB.Bson;
using skillup.server.Models;

namespace skillup.server.Services
{
    public interface ICourseService
    {
        Task<List<Course>> GetAllCourseAsync();
        Task<Course?> GetCourseByIdAsync(string id);
        Task<Course> AddCourseAsync(Course course);
        Task UpdateCourseAsync(Course course);
        Task DeleteCourseAsync(string id);
    }
}