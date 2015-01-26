namespace x_todo.Migrations {
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using x_todo.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<x_todo.Models.XTodoContext> {
        public Configuration() {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(x_todo.Models.XTodoContext context) {
            //  This method will be called after migrating to the latest version.
        }
    }
}
