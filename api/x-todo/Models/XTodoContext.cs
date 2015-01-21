using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace x_todo.Models {

    public class XTodoContext : DbContext, IXTodoContext {

        public XTodoContext() : base("name=XTodoContext") {
            this.Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Task> Tasks { get; set; }
        public DbSet<Category> Categories { get; set; }

        public void MarkAsModified(IEntity e) {
            this.Entry(e).State = EntityState.Modified;
        }

    }
}