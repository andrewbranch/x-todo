﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using x_todo.Models;

namespace x_todo.Controllers {

    [EnableCors("*", "*", "*")]
    public class TasksController : ApiController {

        private IXTodoContext db = new XTodoContext();
        private const string BAD_CATEGORY_ID_MESSAGE = "The task's CategoryId is invalid";

        public TasksController() { }

        public TasksController(IXTodoContext context) {
            db = context;
        }

        // GET: api/Tasks
        public IQueryable<Task> GetTasks() {
            return db.Tasks;
        }

        // POST: api/Tasks
        public async System.Threading.Tasks.Task<IHttpActionResult> PostTask(Task task) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            if (!await HasValidCategoryId(task)) {
                return BadRequest(BAD_CATEGORY_ID_MESSAGE);
            }

            db.Tasks.Add(task);
            await db.SaveChangesAsync();
            return CreatedAtRoute("DefaultApi", new { id = task.Id }, task);
        }

        // PUT: api/Tasks
        public async System.Threading.Tasks.Task<IHttpActionResult> PutTask(int id, Task task) {

            if (id != task.Id) {
                return BadRequest("Provided Id does not match task Id");
            }

            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            if (!await HasValidCategoryId(task)) {
                return BadRequest(BAD_CATEGORY_ID_MESSAGE);
            }

            db.MarkAsModified(task);
            try {
                await db.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (db.Tasks.Count(t => t.Id == id) > 0) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE: api/Tasks
        public async System.Threading.Tasks.Task<IHttpActionResult> DeleteTask(int id) {
            var task = await db.Tasks.FindAsync(id);
            if (task == null) {
                return NotFound();
            }

            db.Tasks.Remove(task);
            await db.SaveChangesAsync();

            return Ok(task);
        }


        protected override void Dispose(bool disposing) {
            if (disposing) {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private async System.Threading.Tasks.Task<bool> HasValidCategoryId(Task task) {
            return await db.Categories.FindAsync(task.CategoryId) != null;
        }

    }
}
