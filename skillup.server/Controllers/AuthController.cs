using Microsoft.AspNetCore.Mvc;
using skillup.server.Models;
using skillup.server.Services;

namespace skillup.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var user = await _authService.RegisterAsync(
                request.Firstname, request.Lastname, request.Email, request.Password);

            if (user == null)
                return BadRequest(new { message = "Email is already in use." });

            return Ok(new
            {
                user.Id,
                user.Firstname,
                user.Lastname,
                user.Email
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);

            if (token == null)
                return Unauthorized(new { message = "Invalid credentials." });

            return Ok(new { token });
        }
    }

    public record RegisterRequest(string Firstname, string Lastname, string Email, string Password);
    public record LoginRequest(string Email, string Password);
}
