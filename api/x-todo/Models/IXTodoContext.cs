using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace x_todo.Models {

    public interface IXTodoContext : IDisposable {

        DbSet<Task> Tasks { get; set; }
        int SaveChanges();
        System.Threading.Tasks.Task<int> SaveChangesAsync();
        void MarkAsModified(Task task);

    }
}
