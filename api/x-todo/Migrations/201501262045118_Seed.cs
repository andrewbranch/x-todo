namespace x_todo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    using x_todo.Models;
    
    public partial class Seed : DbMigration
    {
        public override void Up() {
            using (var context = new XTodoContext()) {
                var work = new Category("Work") { Index = 0, Color = "#b768b7" };
                var adventure = new Category("Adventure") { Index = 1, Color = "#68b7b7" };
                var groceries = new Category("Groceries") { Index = 2, Color = "#68b768" };
                context.Categories.AddOrUpdate(c => c.Name, work, adventure, groceries);
                context.Tasks.AddOrUpdate(
                    new Task() { Title = "Get a job", Index = 0, Category = work },
                    new Task() { Title = "Buy a kayak and go", Index = 0, Category = adventure },
                    new Task() { Title = "Visit Yosemite", Index = 1, Category = adventure },
                    new Task() { Title = "Pink Lady apples", Index = 0, Category = groceries },
                    new Task() { Title = "Fresh mozzarella", Index = 1, Category = groceries },
                    new Task() { Title = "Roma tomatoes", Index = 2, Category = groceries },
                    new Task() { Title = "Olive oil", Index = 3, Category = groceries }
                );
                context.SaveChanges();
            }
        }
        
        public override void Down()
        {
        }
    }
}
