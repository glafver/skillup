using Microsoft.AspNetCore.Mvc;
using skillup.server.Models;
using skillup.server.Services;
using MongoDB.Bson;

namespace skillup.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            _userService.CreateUser(user);
            return Ok(new { message = "User registered successfully" });
        }
    }
}