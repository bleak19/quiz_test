namespace quiz_test.backend.Models
{
    public class Category
    {
        public int Id {get; set;}
        public string Name {get; set;} = null!;
        public List<Question> Questions {get; set;} = new();
    }
}
