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

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Id)
                    .HasConversion(
                        id => id.ToString(),// MongoDB ObjectId till string när det sparas
                        value => MongoDB.Bson.ObjectId.Parse(value) // string till ObjectId när det läses
                    );
            });
        }

    }

}