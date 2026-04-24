using Microsoft.EntityFrameworkCore;
using quiz_test.backend.Data;
using quiz_test.backend.Models;
using quiz_test.backend.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Data.Common;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<QuizDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentity<QuizUser, IdentityRole>()
    .AddEntityFrameworkStores<QuizDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddPolicy("angular", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "QuizAuthCookie";
    options.Cookie.HttpOnly = true;
    
    // THE FIX: Set to None and Secure
    options.Cookie.SameSite = SameSiteMode.None; 
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; 

    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("angular");
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapAuthEndpoints();
app.MapQuestionEndpoints();
app.MapQuizEndpoints();
app.MapTestEndpoints();

void seedDb(QuizDbContext db)
{
    var categories = db.Categories.ToList();
    if (!categories.Any()) return;

    const int questionsPerCategory = 5; // or 50 if you really want that many

    foreach (var category in categories)
    {
        // Optional: skip if this category already has enough questions
        // int existing = db.Questions.Count(q => q.CategoryId == category.Id);
        // if (existing >= questionsPerCategory) continue;

        for (int i = 1; i <= questionsPerCategory; i++)
        {
            var q = new Question
            {
                Text = $"Sample question {i} for {category.Name}?",
                CategoryId = category.Id,   // use the outer category variable
                Answers = new List<Answer>
                {
                    new Answer { Text = "Answer A", IsCorrect = true },
                    new Answer { Text = "Answer B", IsCorrect = false },
                    new Answer { Text = "Answer C", IsCorrect = false },
                    new Answer { Text = "Answer D", IsCorrect = false }
                }
            };
            db.Questions.Add(q);
        }
    }

    db.SaveChanges();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<QuizDbContext>();
    //seedDb(db);
}



app.Run();

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);

