public interface ICertificateService
{
    Task<Certificate> IssueAsync(string userId, string courseSlug);
    Task<Certificate?> GetByIdAsync(string id);
    Task<List<Certificate>> GetAllForUserAsync(string userId);
    Task<Certificate?> GetByCourseSlugAsync(string userId, string courseSlug);

}
