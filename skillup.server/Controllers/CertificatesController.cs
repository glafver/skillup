using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using skillup.server.Services;
using skillup.server.Extensions;

[ApiController]
[Route("api/certificates")]
[Authorize]
public class CertificatesController : ControllerBase
{
    private readonly ICertificateService _certService;

    public CertificatesController(ICertificateService certService)
    {
        _certService = certService;
    }

    [HttpPost("{slug}")]
    public async Task<IActionResult> Issue(string slug)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        try
        {
            var certificate = await _certService.IssueAsync(userId, slug);
            return Ok(certificate);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyCertificates()
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var certificates = await _certService.GetAllForUserAsync(userId);
        return Ok(certificates);
    }

    [HttpGet("me/{courseSlug}")]
    public async Task<IActionResult> GetMyCertificateBySlug(string courseSlug)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var certificate = await _certService.GetByCourseSlugAsync(userId, courseSlug);
        if (certificate == null) return NotFound();

        return Ok(certificate);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var certificate = await _certService.GetByIdAsync(id);
        if (certificate == null) return NotFound();
        if (certificate.UserId != userId) return Forbid(); // skydda mot läsning av andras cert

        return Ok(certificate);
    }
}
