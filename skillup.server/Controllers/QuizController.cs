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

    // GET api/quiz?level=js_beginner
    [HttpGet]
    public async Task<ActionResult<List<Quiz>>> GetQuizzes([FromQuery] string level)
    {
        var quizzes = await _quizService.GetQuizzesByLevelAsync(level);
        return Ok(quizzes);
    }

    // POST api/quiz
    [HttpPost]
    public async Task<ActionResult<Quiz>> CreateQuiz([FromBody] Quiz quiz)
    {
        var createdQuiz = await _quizService.AddQuizAsync(quiz);
        return CreatedAtAction(nameof(GetQuizzes), new { id = createdQuiz.Id }, createdQuiz);
    }
}
