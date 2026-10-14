using Microsoft.AspNetCore.Mvc;
using skillup.server.Models;
using skillup.server.Services;

[Route("api/[controller]")]
[ApiController]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    // GET api/quiz/javascript?level=Beginner
    [HttpGet("{slug}")]
    public async Task<ActionResult<List<Quiz>>> GetQuizzesBySlug(string slug, [FromQuery] string level)
    {
        var quizzes = await _quizService.GetQuizzesBySlugAndLevelAsync(slug, level);
        return Ok(quizzes);
    }
}
