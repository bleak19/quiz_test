using Microsoft.AspNetCore.Identity.EntityFrameworkCore; // Add this using
using Microsoft.EntityFrameworkCore;
using quiz_test.backend.Models;

namespace quiz_test.backend.Data;

// Inherit from IdentityDbContext instead of DbContext
public class QuizDbContext : IdentityDbContext<QuizUser>
{
    public QuizDbContext(DbContextOptions<QuizDbContext> options)
        : base(options)
    {

    }

    // You can remove the manual DbSet<QuizUser> line 
    // because IdentityDbContext already includes it!
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Test> Tests { get; set; }

}