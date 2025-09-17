using Microsoft.AspNetCore.Mvc;
using skillup.server.Models;
using skillup.server.Services;

namespace skillup.server.Controllers
{
    [ApiController]
    [Route("api/course-content")]
    public class CourseContentController : ControllerBase
    {
        private readonly CourseContentService _svc;

        public CourseContentController(CourseContentService svc)
        {
            _svc = svc;
        }

        [HttpGet]
        public async Task<ActionResult<List<CourseContent>>> GetAll()
        {
            var content = await _svc.GetAllAsync();
            return Ok(content);
        }

        [HttpGet("{slug}")]
        public async Task<ActionResult<CourseContent>> GetBySlug(string slug)
        {
            var doc = await _svc.GetBySlugAsync(slug);
            if (doc == null) return NotFound();
            return Ok(doc);
        }
    }
}
