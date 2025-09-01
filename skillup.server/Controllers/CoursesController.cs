using Microsoft.AspNetCore.Mvc;

namespace skillup.server.Controllers
{
    [ApiController]
    [Route("api/courses")]
    public class CoursesController : Controller
    {
        [HttpGet]
        public IActionResult GetCourses()
        {
            var courses = new string[]
            {
                "JavaScript",
                "C#",
                "Python"
            };

            return Ok(courses);
        }
    }
}
