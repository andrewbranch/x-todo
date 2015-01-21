﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace x_todo.Models {

    public class Task : IEntity {

        public Task(string title, DateTime dueDate) {
            this.Title = title;
            this.DueDate = dueDate;
        }

        public Task(string title) {
            this.Title = title;
        }

        public Task() { }

        public int Id { get; set; }
        [Required, MinLength(1)]
        public string Title { get; set; }
        public DateTime? DueDate { get; set; }
    }
}