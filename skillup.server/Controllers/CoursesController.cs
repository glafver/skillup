using Microsoft.AspNetCore.Mvc;
using skillup.server.Models;
using skillup.server.Services;
using skillup.server.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace skillup.server.Controllers
{
    [ApiController]
    [Route("api/courses")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _service;

        public CoursesController(ICourseService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _service.GetAllCourseAsync();
            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var course = await _service.GetCourseByIdAsync(id);
            return course is null ? NotFound() : Ok(course);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Course course)
        {
            try
            {
                var created = await _service.AddCourseAsync(course);
                return Ok(created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Course course)
        {
            if (course.Id.ToString() != id)
                return BadRequest(new { message = "Route id and payload id must match." });

            await _service.UpdateCourseAsync(course);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _service.DeleteCourseAsync(id);
            return NoContent();
        }

       [HttpPost("{slug}/started")]
        [Authorize]
        public async Task<IActionResult> StartCourse(string slug)
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();

            var result = await _service.AddActiveCourseAsync(userId, slug);
            return Ok(new { message = "Course started!", result });
        }

        [HttpGet("{slug}/status")]
        [Authorize]
        public async Task<IActionResult> GetCourseStatus(string slug)
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();

            var isActive = await _service.IsCourseActiveAsync(userId, slug);
            return Ok(new { active = isActive });
        }

    }
}
