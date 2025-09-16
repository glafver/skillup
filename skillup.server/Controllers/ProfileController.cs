using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using skillup.server.Models;
using skillup.server.Services;
using System.Security.Claims;

namespace skillup.server.Controllers
{
    public class UpdateProfileRequest
    {
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string? ConfirmPassword { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPasswordHasher<User> _passwordHasher;

        public ProfileController(IUserService userService, IPasswordHasher<User> passwordHasher)
        {
            _userService = userService;
            _passwordHasher = passwordHasher;
        }

        [Authorize]
        [HttpGet("current")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Firstname,
                user.Lastname,
                user.Email
            });
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();

            user.Firstname = request.Firstname;
            user.Lastname = request.Lastname;
            user.Email = request.Email;

            if (!string.IsNullOrEmpty(request.Password))
            {
                if (request.Password != request.ConfirmPassword)
                    return BadRequest(new { message = "Passwords do not match." });

                user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
            }

            var result = await _userService.UpdateAsync(user);
            if (!result) return BadRequest(new { message = "Failed to update profile." });

            return Ok(new { message = "Profile updated successfully." });
        }
    }
}
