namespace x_todo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FleshOutModels : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tasks", "Completed", c => c.Boolean(nullable: false));
            AddColumn("dbo.Tasks", "Index", c => c.Int(nullable: false));
            AddColumn("dbo.Categories", "Color", c => c.String());
            AddColumn("dbo.Categories", "Disclosed", c => c.Boolean(nullable: false, defaultValue: true));
            AddColumn("dbo.Categories", "Index", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Categories", "Index");
            DropColumn("dbo.Categories", "Disclosed");
            DropColumn("dbo.Categories", "Color");
            DropColumn("dbo.Tasks", "Index");
            DropColumn("dbo.Tasks", "Completed");
        }
    }
}
