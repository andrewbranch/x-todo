using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using x_todo.Models;
using x_todo.Controllers;
using System.Collections.Generic;
using System.Web.Http.Results;
using System.Net;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Http;

namespace x_todo.Tests {

    [TestClass]
    public class TestTasksController {

        [TestMethod]
        public void GetTasks_ShouldReturnAllTasks() {
            var context = new TestXTodoContext();
            context.Tasks.Add(new Task(1, "Get a job"));
            context.Tasks.Add(new Task(1, "Move across the country"));
            context.Tasks.Add(new Task(1, "Visit Yosemite"));

            var controller = new TasksController(context);
            var result = controller.GetTasks() as TestDbSet<Task>;
            Assert.IsNotNull(result);
            Assert.AreEqual(3, result.Local.Count);
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PostTask_ShouldReturnSameTask() {
            var controller = new TasksController(new TestXTodoContext());
            var task = new Task(1, "Go kayaking", DateTime.Now) { Id = 1 };


            RunValidations(controller, task);
            var result = await controller.PostTask(task) as CreatedAtRouteNegotiatedContentResult<Task>;

            Assert.IsNotNull(result);
            Assert.AreEqual("DefaultApi", result.RouteName);
            Assert.AreEqual(result.Content.Id, result.RouteValues["id"]);
            Assert.AreEqual(result.Content.Title, task.Title);
            Assert.AreEqual(result.Content.DueDate, task.DueDate);
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PostTask_ShouldFailWhenTitleIsNull() {
            var controller = new TasksController(new TestXTodoContext());
            var task = new Task();

            RunValidations(controller, task);
            var result = await controller.PostTask(task);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PostTask_ShouldFailWhenTitleIsEmptyOrWhitespace() {
            var controller = new TasksController(new TestXTodoContext());
            var task = new Task(1, " ");

            RunValidations(controller, task);
            var result = await controller.PostTask(task);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutTask_ShouldReturnStatusCode() {
            var controller = new TasksController(new TestXTodoContext());
            var task = new Task(1, "Go kayaking") { Id = 1 };

            RunValidations(controller, task);
            var result = await controller.PutTask(task.Id, task) as StatusCodeResult;

            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(StatusCodeResult));
            Assert.AreEqual(HttpStatusCode.NoContent, result.StatusCode);
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutTask_ShouldFailForNonMatchingIds() {
            var controller = new TasksController(new TestXTodoContext());
            var task = new Task(1, "Go kayaking") { Id = 1 };

            RunValidations(controller, task);
            var result = await controller.PutTask(2, task);

            Assert.IsInstanceOfType(result, typeof(BadRequestErrorMessageResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutTask_ShouldFailWhenTitleIsNull() {
            var controller = new TasksController(new TestXTodoContext());
            var task = new Task() { Id = 1 };

            RunValidations(controller, task);
            var result = await controller.PutTask(task.Id, task);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutTask_ShouldFailWhenTitleIsEmptyOrWhitespace() {
            var controller = new TasksController(new TestXTodoContext());
            var task = new Task(1, " ") { Id = 1 };

            RunValidations(controller, task);
            var result = await controller.PutTask(task.Id, task);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task DeleteTask_ShouldReturnOk() {
            var context = new TestXTodoContext();
            var controller = new TasksController(context);
            var task = new Task(1, "Go kayaking") { Id = 1 };
            context.Tasks.Add(task);

            var result = await controller.DeleteTask(task.Id) as OkNegotiatedContentResult<Task>;
            Assert.IsNotNull(result);
            Assert.AreEqual(task.Id, result.Content.Id);
        }

        private void RunValidations(TasksController controller, Task task) {
            var validationContext = new ValidationContext(task);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(task, validationContext, validationResults, true);

            foreach (var r in validationResults) {
                controller.ModelState.AddModelError(r.MemberNames.First(), r.ErrorMessage);
            }
        }
    }
}
