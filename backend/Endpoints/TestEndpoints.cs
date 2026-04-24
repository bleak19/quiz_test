using System.ComponentModel;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using quiz_test.backend.Data;
using quiz_test.backend.DTOs;
using quiz_test.backend.Models;
public static class TestEndpoints
{
    public static void MapTestEndpoints(this WebApplication app)
    {

        app.MapGet("/GetTest", async ([FromServices] QuizDbContext db, [FromQuery] Guid guid) =>
        {
            var test = await db.Tests
                .Where(t => t.Id == guid)
                .Select(t => new
                {
                    t.Id,
                    t.TestName,
                    Questions = t.Questions.Select(q => new QuestionForUserDto
                    {
                        Id = q.Id,
                        Text = q.Text ?? string.Empty,
                        Answers = q.Answers.Select(a => new AnswerForUserDto
                        {
                            Id = a.Id,
                            Text = a.Text ?? string.Empty
                        }).ToList()
                    }).ToList()
                }).FirstOrDefaultAsync();

            return Results.Ok(test);
        });


        app.MapGet("/GetTestPreview", async ([FromServices] QuizDbContext db, [FromQuery] int categoryId) =>
        {
            var questions = await db.Questions
                .Where(q => q.CategoryId == categoryId)
                .OrderBy(q => Guid.NewGuid())
                .Take(10)
                .Select(q => new QuestionDto {
                    Id = q.Id,
                    Text = q.Text ?? "Question Text",
                    CategoryId = q.CategoryId,
                    Answers = q.Answers
                    .Select(a => new AnswerDto {
                        Text = a.Text ?? "Text",
                        IsCorrect = a.IsCorrect}).ToList()
                }).ToListAsync();

            return Results.Ok(new TestPreview{
                CategoryId = categoryId,
                TestName = "Test Preview",
                TimeLimit = 10,
                Questions = questions
            });
        });

        app.MapGet("/GetCustomTest", async ([FromServices] QuizDbContext db, [FromQuery] string customName) =>
        {
            throw new NotImplementedException();

        });

        app.MapPost("/SaveTest", async ([FromServices] QuizDbContext db, [FromBody] SaveTestRequest request) =>
        {
            var questions = await db.Questions
                .Where(q => request.QuestionIds.Contains(q.Id))
                .ToListAsync();

            var newTest = new Test
            {
                Id = Guid.NewGuid(),
                CategoryId = request.CategoryId,
                TestName = request.TestName,
                TimeLimit = request.Duration,
                Questions = questions
            };

            db.Tests.Add(newTest);
            await db.SaveChangesAsync();

            return Results.Ok(newTest.Id);
        });

    }
}
