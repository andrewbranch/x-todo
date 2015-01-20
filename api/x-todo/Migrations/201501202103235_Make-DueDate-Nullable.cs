namespace x_todo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeDueDateNullable : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Tasks", "DueDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Tasks", "DueDate", c => c.DateTime(nullable: false));
        }
    }
}
