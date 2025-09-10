namespace skillup.server.Services
{
    using Microsoft.EntityFrameworkCore;
    using skillup.server.Models;
    public class SkillupDbContext : DbContext
    {
        

        public DbSet<User> Users { get; set; }

        public DbSet<Course> Courses { get; set; }

        public SkillupDbContext(DbContextOptions<SkillupDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            

                modelBuilder.Entity<User>(entity =>
                {
                    entity.HasIndex(u => u.Email).IsUnique();
                });

                modelBuilder.Entity<Course>(entity =>
                {

                    entity.HasIndex(c => c.Title).IsUnique();
                    
                });

            base.OnModelCreating(modelBuilder);

        }

    }

}