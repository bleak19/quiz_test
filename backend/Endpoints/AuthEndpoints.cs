using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using quiz_test.backend.Data;
using quiz_test.backend.DTOs;
using quiz_test.backend.Models;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        app.MapPost("/register", async (UserManager<QuizUser> userManager, SignInManager<QuizUser> signInManager, RegisterRequest request) =>
        {
            var user = new QuizUser
            {
                UserName = request.Email,
                Email = request.Email
            };

            var result = await userManager.CreateAsync(user, request.Password);
            await signInManager.PasswordSignInAsync(request.Email, request.Password, isPersistent: true, lockoutOnFailure: false);

        if (!result.Succeeded)
            return Results.BadRequest(result.Errors);

        return Results.Ok("User created");
        });

        app.MapPost("/login", async (SignInManager<QuizUser> signInManager, LoginRequest request) =>
        {
            var result = await signInManager.PasswordSignInAsync(
                request.Email,
                request.Password,
                isPersistent: true,
                lockoutOnFailure: false);

            if (!result.Succeeded)
                return Results.Unauthorized();

            return Results.Ok("Logged in");
        });

        app.MapPost("/logout", async (SignInManager<QuizUser> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return Results.Ok("Logged out");
        });

        app.MapGet("/me", (HttpContext context) =>
        {
            if (context.User.Identity?.IsAuthenticated != true)
                return Results.Unauthorized();

            var email = context.User.Identity.Name;

            return Results.Ok(new
            {
                email
            });
        });

        app.MapGet("/logout", async (SignInManager<QuizUser> signInManager) =>
        {
            await signInManager.SignOutAsync();
        });
    }
}
