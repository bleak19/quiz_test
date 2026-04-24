namespace quiz_test.backend.Models
{
    public class Question
    {
    public int Id { get; set; }
    public string? Text { get; set; }

    public int CategoryId { get; set; }      
    public Category Category { get; set; } = null!;
    public List<Answer> Answers { get; set; } = new();
    }
}
