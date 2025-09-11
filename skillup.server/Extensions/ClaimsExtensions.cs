using System.Security.Claims;

namespace skillup.server.Extensions
{
    public static class ClaimsExtensions
    {
        public static string? GetUserId(this ClaimsPrincipal user) =>
            user.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}