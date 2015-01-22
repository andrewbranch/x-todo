using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace x_todo.Models {

    public class Task : IEntity {

        public Task(int categoryId, string title, DateTime? dueDate) {
            this.CategoryId = categoryId;
            this.Title = title;
            this.DueDate = dueDate;
        }

        public Task(int categoryId, string title) : this(categoryId, title, null) { }

        public Task() { }

        public int Id { get; set; }
        [Required, MinLength(1)]
        public string Title { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Completed { get; set; }
        public int Index { get; set; }
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId"), JsonIgnore]
        public virtual Category Category { get; set; }
    }
}