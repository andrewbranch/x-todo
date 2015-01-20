using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using x_todo.Models;

namespace x_todo.Controllers {

    public class TasksController : ApiController {

        private XTodoContext db = new XTodoContext();

        // GET: api/Tasks
        public IQueryable<Task> GetTasks() {
            return db.Tasks;
        }

        // POST: api/Tasks
        public async System.Threading.Tasks.Task<IHttpActionResult> PostTask(Task task) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            db.Tasks.Add(task);
            await db.SaveChangesAsync();
            return CreatedAtRoute("DefaultApi", new { id = task.Id }, task);
        }

        // PUT: api/Tasks
        public async System.Threading.Tasks.Task<IHttpActionResult> PutTask(int id, Task task) {
            task.Id = id;
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            db.Entry(task).State = EntityState.Modified;
            try {
                await db.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException e) {
                if (db.Tasks.Count(t => t.Id == id) > 0) {
                    return NotFound();
                } else {
                    throw e;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE: api/Tasks
        [HttpDelete]
        public async System.Threading.Tasks.Task<IHttpActionResult> DeleteTask(int id) {
            var task = await db.Tasks.FindAsync(id);
            if (task == null) {
                return NotFound();
            }

            db.Tasks.Remove(task);
            await db.SaveChangesAsync();

            return Ok(task);
        }

    }
}
