using System.ComponentModel;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using quiz_test.backend.Data;
using quiz_test.backend.DTOs;
using quiz_test.backend.Models;
public static class QuestionEndpoints
{
    public static void MapQuestionEndpoints(this WebApplication app)
    {
        app.MapPost("/AddQuestion", async (QuizDbContext db, AddQuestionRequest request) =>
        {
            var question = new Question
            {
                Text = request.Text,
                CategoryId = request.CategoryId,
                Answers = request.Answers.Select(a => new Answer
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList()
            };

            db.Questions.Add(question);
            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Question added successfully" });
        });


        app.MapGet("/GetAllCategories", async ([FromServices] QuizDbContext db) =>
        {
            var categories = await db.Categories.Select(c => new { c.Id, c.Name }).ToListAsync();
            return Results.Ok(categories);
        });

        app.MapPost("/PostCategory", async ([FromServices] QuizDbContext db, [FromBody] CreateCategoryDto categoryName) =>
        {
            Category category = new Category
            {
                Name = categoryName.Name
            };

            db.Categories.Add(category);
            await db.SaveChangesAsync();

            return Results.Ok(new CategoryDto{ Id = category.Id, Name = category.Name});
        });
    }
}
