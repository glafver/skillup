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

    // POST api/quiz
    [HttpPost]
    public async Task<ActionResult<Quiz>> CreateQuiz([FromBody] Quiz quiz)
    {
        var createdQuiz = await _quizService.AddQuizAsync(quiz);
        return CreatedAtAction(nameof(GetQuizzesBySlug), new { slug = createdQuiz.Slug, level = createdQuiz.Level }, createdQuiz);
    }
}
