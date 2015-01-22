using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace x_todo.Models {

    public class Category : IEntity {

        public Category() { }

        public Category(string name) {
            this.Name = name;
        }

        public int Id { get; set; }
        [Required, MinLength(1)]
        public string Name { get; set; }
        public string Color { get; set; }
        [DefaultValue(true)]
        public bool Disclosed { get; set; }
        public int Index { get; set; }

        public virtual ICollection<Task> Tasks { get; set; }

    }
}