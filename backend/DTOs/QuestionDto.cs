using quiz_test.backend.Models;

namespace quiz_test.backend.DTOs;
public class AddQuestionRequest
{
    public string Text { get; set; } = null!;
    public int CategoryId {get; set;}
    public List<AnswerRequest> Answers { get; set; } = new();
}

public class AnswerRequest
{
    public string Text { get; set; } = null!;
    public bool IsCorrect { get; set; }
}

public class QuestionForUserDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public List<AnswerForUserDto> Answers { get; set; } = new();
}

public class AnswerForUserDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
}

public class CreateCategoryDto
{
    public string Name { get; set; } = null!;

}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name {get; set;} = string.Empty;

}

public class SaveTestRequest
{
    public int CategoryId { get; set; }
    public int[] QuestionIds { get; set; } = [];
    public string TestName { get; set; } = string.Empty;
    public int Duration { get; set; }
}

public class TestPreview
{
    public int CategoryId {get; set;}
    public string TestName {get; set;} = string.Empty;
    public int TimeLimit {get; set;}
    public List<QuestionDto> Questions {get; set;} = new();

}

public class AnswerDto
{
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public List<AnswerDto> Answers { get; set; } = new();
}