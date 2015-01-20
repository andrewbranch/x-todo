using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace x_todo.Models {

    public class XTodoContext : DbContext {

        public DbSet<Task> Tasks { get; set; }

    }
}