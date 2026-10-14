using Microsoft.AspNetCore.Mvc;
using skillup.server.Services;

namespace skillup.server.Controllers
{
    /// <summary>
    /// Health endpoint. It actually talks to MongoDB, so a scheduled request to it also
    /// counts as activity and keeps a free Atlas cluster from being paused.
    /// </summary>
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        private readonly CourseContentService _content;

        public HealthController(CourseContentService content)
        {
            _content = content;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var databaseUp = await _content.PingAsync();

            if (!databaseUp)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                {
                    status = "degraded",
                    database = "down"
                });
            }

            return Ok(new { status = "ok", database = "up" });
        }
    }
}
