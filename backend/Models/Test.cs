namespace quiz_test.backend.Models;

public class Test
{
    public Guid Id {get; set;}
    public int? CategoryId {get; set;}
    public string TestName {get; set;} = string.Empty;
    public int TimeLimit {get; set;}
    public List<Question> Questions {get; set;} = null!;

}