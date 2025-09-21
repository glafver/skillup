using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using skillup.server.Models;

namespace skillup.server.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly SkillupDbContext _context;

        public CertificateService(SkillupDbContext context)
        {
            _context = context;
        }

        public async Task<Certificate> IssueAsync(string userId, string courseSlug)
        {
            var existing = await _context.Certificates
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.UserId == userId && c.CourseSlug == courseSlug);

            if (existing != null)
                return existing;

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId || (u.Id is string && (string)(object)u.Id == userId));

            if (user == null)
                throw new InvalidOperationException("User not found");

            var course = await _context.Courses
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Slug == courseSlug);

            if (course == null)
                throw new InvalidOperationException("Course not found");

            var certificate = new Certificate
            {
                Id          = ObjectId.GenerateNewId().ToString(),
                UserId      = userId,
                CourseSlug  = courseSlug,
                Firstname   = user.Firstname,
                Lastname    = user.Lastname,
                CourseTitle = course.Title,
                IssuedAt    = DateTime.UtcNow
            };

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();

            return certificate;
        }

        public async Task<Certificate?> GetByIdAsync(string id)
        {
            return await _context.Certificates
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Certificate>> GetAllForUserAsync(string userId)
        {
            return await _context.Certificates
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.IssuedAt)
                .ToListAsync();
        }

        public async Task<Certificate?> GetByCourseSlugAsync(string userId, string courseSlug)
        {
            return await _context.Certificates
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.UserId == userId && c.CourseSlug == courseSlug);
        }
    }
}
