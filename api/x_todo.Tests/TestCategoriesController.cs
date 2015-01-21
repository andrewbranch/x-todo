using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using x_todo.Models;
using x_todo.Controllers;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.ComponentModel.DataAnnotations;
using System.Web.Http.Results;
using System.Net;

namespace x_todo.Tests {

    [TestClass]
    public class TestCategoriesController {

        [TestMethod]
        public void GetCategories_ShouldReturnAllCategories() {
            var context = new TestXTodoContext();
            context.Categories.Add(new Category("Work"));
            context.Categories.Add(new Category("Personal"));
            context.Categories.Add(new Category("Bucket List"));

            var controller = new CategoriesController(context);
            var result = controller.GetCategories() as TestDbSet<Category>;
            Assert.IsNotNull(result);
            Assert.AreEqual(3, result.Local.Count);
        }

        [TestMethod]
        public void GetCategories_ShouldIncludeAllTasks() {
            var context = new TestXTodoContext();
            context.Categories.Add(new Category("Work") {
                Id = 1,
                Tasks = new List<Task> { new Task(1, "Get a job") }
            });
            context.Categories.Add(new Category("Personal") {
                Id = 2,
                Tasks = new List<Task> { new Task(2, "Move across the country") }
            });
            context.Categories.Add(new Category("Adventure") {
                Id = 3,
                Tasks = new List<Task> {
                    new Task(3, "Visit Yosemite"),
                    new Task(3, "Go Kayaking")
                }
            });

            var controller = new CategoriesController(context);
            var result = controller.GetCategories() as TestDbSet<Category>;
            Assert.IsNotNull(result);
            Assert.AreEqual(4, result.Local.SelectMany(c => c.Tasks).Count());
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PostCategory_ShouldReturnSameCategory() {
            var controller = new CategoriesController(new TestXTodoContext());
            var category = new Category("Work") { Id = 1 };


            RunValidations(controller, category);
            var result = await controller.PostCategory(category) as CreatedAtRouteNegotiatedContentResult<Category>;

            Assert.IsNotNull(result);
            Assert.AreEqual("DefaultApi", result.RouteName);
            Assert.AreEqual(result.Content.Id, result.RouteValues["id"]);
            Assert.AreEqual(result.Content.Name, category.Name);
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PostCategory_ShouldFailWhenTitleIsNull() {
            var controller = new CategoriesController(new TestXTodoContext());
            var category = new Category();

            RunValidations(controller, category);
            var result = await controller.PostCategory(category);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PostCategory_ShouldFailWhenTitleIsEmptyOrWhitespace() {
            var controller = new CategoriesController(new TestXTodoContext());
            var category = new Category(" ");

            RunValidations(controller, category);
            var result = await controller.PostCategory(category);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutCategory_ShouldReturnStatusCode() {
            var controller = new CategoriesController(new TestXTodoContext());
            var category = new Category("Work") { Id = 1 };

            RunValidations(controller, category);
            var result = await controller.PutCategory(category.Id, category) as StatusCodeResult;

            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(StatusCodeResult));
            Assert.AreEqual(HttpStatusCode.NoContent, result.StatusCode);
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutCategory_ShouldFailForNonMatchingIds() {
            var controller = new CategoriesController(new TestXTodoContext());
            var category = new Category("Work") { Id = 1 };

            RunValidations(controller, category);
            var result = await controller.PutCategory(2, category);

            Assert.IsInstanceOfType(result, typeof(BadRequestErrorMessageResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutCategory_ShouldFailWhenTitleIsNull() {
            var controller = new CategoriesController(new TestXTodoContext());
            var category = new Category() { Id = 1 };

            RunValidations(controller, category);
            var result = await controller.PutCategory(category.Id, category);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task PutCategory_ShouldFailWhenTitleIsEmptyOrWhitespace() {
            var controller = new CategoriesController(new TestXTodoContext());
            var category = new Category(" ") { Id = 1 };

            RunValidations(controller, category);
            var result = await controller.PutCategory(category.Id, category);

            Assert.IsInstanceOfType(result, typeof(InvalidModelStateResult));
        }

        [TestMethod]
        public async System.Threading.Tasks.Task DeleteCategory_ShouldReturnOk() {
            var context = new TestXTodoContext();
            var controller = new CategoriesController(context);
            var category = new Category("Work") { Id = 1 };
            context.Categories.Add(category);

            var result = await controller.DeleteCategory(category.Id) as OkNegotiatedContentResult<Category>;
            Assert.IsNotNull(result);
            Assert.AreEqual(category.Id, result.Content.Id);
        }

        private void RunValidations(ApiController controller, IEntity entity) {
            var validationContext = new ValidationContext(entity);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(entity, validationContext, validationResults, true);

            foreach (var r in validationResults) {
                controller.ModelState.AddModelError(r.MemberNames.First(), r.ErrorMessage);
            }
        }
    }
}
