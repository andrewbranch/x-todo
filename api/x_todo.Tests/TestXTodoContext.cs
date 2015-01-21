using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using x_todo.Models;

namespace x_todo.Tests {

    class TestXTodoContext : IXTodoContext {

        public TestXTodoContext() {
            this.Tasks = new TestDbSet<Task>();
            this.Categories = new TestDbSet<Category>();
        }

        public DbSet<Task> Tasks { get; set; }
        public DbSet<Category> Categories { get; set; }

        public int SaveChanges() {
            return 0;
        }

        public System.Threading.Tasks.Task<int> SaveChangesAsync() {
            return System.Threading.Tasks.Task.FromResult(0);
        }

        public void MarkAsModified(IEntity e) { }
        public void Dispose() { }

    }
}
