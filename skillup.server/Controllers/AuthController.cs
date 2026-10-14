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
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        /// <summary>
        /// Credentials of the shared demonstration account, so a visitor can look
        /// around without registering. Returns 404 when no demo account is configured.
        /// This account is public by design - never store anything private in it.
        /// </summary>
        [HttpGet("demo")]
        public IActionResult GetDemoAccount()
        {
            var email = _configuration["Demo:Email"];
            var password = _configuration["Demo:Password"];

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return NotFound();

            return Ok(new { email, password });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var user = await _authService.RegisterAsync(
                request.Firstname, request.Lastname, request.Email, request.Password, request.Avatar);

            if (user == null)
                return BadRequest(new { message = "Email is already in use." });
        
            return Ok(new
            {
                user.Id,
                user.Firstname,
                user.Lastname,
                user.Email,
                user.Avatar
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

    public record RegisterRequest(string Firstname, string Lastname, string Email, string Password, string Avatar);
    public record LoginRequest(string Email, string Password);
}
