using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using skillup.server.Models;
using skillup.server.Services;
using System.Security.Claims;

namespace skillup.server.Controllers
{
    public record UpdateEmailRequest(string Email);
    public record UpdatePasswordRequest(string Password);

    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IUserService _userService;

        public ProfileController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("current")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // "sub"
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
        [HttpPut("update-email")]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _userService.UpdateEmailAsync(userId, request.Email);
            if (!result) return BadRequest(new { message = "Failed to update email." });

            return Ok(new { message = "Email updated successfully." });
        }

        [Authorize]
        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _userService.UpdatePasswordAsync(userId, request.Password);
            if (!result) return BadRequest(new { message = "Failed to update password." });

            return Ok(new { message = "Password updated successfully." });
        }
    }
}
