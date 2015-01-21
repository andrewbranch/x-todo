using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace x_todo.Models {

    public class XTodoContext : DbContext, IXTodoContext {

        public DbSet<Task> Tasks { get; set; }

        public void MarkAsModified(Task task) {
            this.Entry(task).State = EntityState.Modified;
        }

    }
}