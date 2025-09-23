using skillup.server.Models;
using skillup.server.Services;
using TechTalk.SpecFlow;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace skillup.tests
{
    [Binding]
    public class LoginSteps
    {
        private AuthService _authService;
        private string? loginResult;
        private Mock<IUserService> _mockUserService;

        [Given(@"att användaren är på login-sidan")]
        public void GivenAttAnvandarenArPaLoginSidan()
        {
            // Mocka IUserService
            _mockUserService = new Mock<IUserService>();

            var user = new User
            {
                Email = "testuser@example.com",
                PasswordHash = new PasswordHasher<User>().HashPassword(null, "password123")
            };

            _mockUserService
                .Setup(s => s.GetByEmailAsync("testuser@example.com"))
                .ReturnsAsync(user);

            // Mocka IConfiguration
            var mockConfig = new Mock<IConfiguration>();
            mockConfig.Setup(c => c["Jwt:Key"]).Returns("supersecretkey12345678901234567890");
            mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("skillup");
            mockConfig.Setup(c => c["Jwt:Audience"]).Returns("skillup-users");
            mockConfig.Setup(c => c["Jwt:DurationInMinutes"]).Returns("60");

            // Skapa AuthService med mocks
            _authService = new AuthService(_mockUserService.Object, mockConfig.Object);
        }

        [When(@"användaren fyller i korrekt användarnamn och lösenord")]
        public async Task WhenAnvandarenFyllerICorrectUsernamePassword()
        {
            loginResult = await _authService.LoginAsync("testuser@example.com", "password123");
        }

        [When(@"användaren fyller i fel användarnamn eller lösenord")]
        public async Task WhenAnvandarenFyllerIFelUsernamePassword()
        {
            loginResult = await _authService.LoginAsync("testuser@example.com", "wrongpassword");
        }

        [When(@"trycker på login-knappen")]
        public void WhenTryckerPaLoginKnappen()
        {
            // Steget är implicit i de andra When-stegen
        }

        [Then(@"ska användaren tas till startsidan")]
        public void ThenSkaAnvandarenTasTillStartsidan()
        {
            Assert.False(string.IsNullOrEmpty(loginResult));
        }

        [Then(@"ska ett felmeddelande visas")]
        public void ThenSkaEttFelmeddelandeVisas()
        {
            Assert.Null(loginResult);
        }
    }
}
