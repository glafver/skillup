namespace skillup.server.Services
{
    using Microsoft.EntityFrameworkCore;
    using skillup.server.Models;
    public class SkillupDbContext : DbContext
    {
        

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<ActiveCourse> ActiveCourses { get; set; }
        public DbSet<Quiz> Quizzes { get; set; } = null!;
        public DbSet<Certificate> Certificates { get; set; } = null!;

        public SkillupDbContext(DbContextOptions<SkillupDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Id)
                    .HasConversion(
                        id => id.ToString(),// MongoDB ObjectId till string när det sparas
                            value => MongoDB.Bson.ObjectId.Parse(value) // string till ObjectId när det läses
                        );
            });

            modelBuilder.Entity<Course>(e =>
            {
                e.HasIndex(c => c.Title).IsUnique();
            });
            
            modelBuilder.Entity<ActiveCourse>(e =>
            {
                e.HasIndex(x => new { x.UserId, x.CourseSlug }).IsUnique();
            });


            modelBuilder.Entity<Quiz>(entity =>
            {
                entity.Property(q => q.Id)
                        .HasConversion(
                            id => id.ToString(),
                            value => MongoDB.Bson.ObjectId.Parse(value)
                        );
            });

            modelBuilder.Entity<Certificate>(e =>
            {
                e.HasIndex(x => new { x.UserId, x.CourseSlug }).IsUnique();
            });

            base.OnModelCreating(modelBuilder);

        }

    }

}