namespace skillup.server.Services
{
    using Microsoft.EntityFrameworkCore;
    using skillup.server.Models;
    public class SkillupDbContext : DbContext
    {
        public SkillupDbContext(DbContextOptions<SkillupDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>();
        }
    }

}