using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using x_todo.Models;

namespace x_todo.Controllers {

    [EnableCors("*", "*", "*")]
    public class CategoriesController : ApiController {

        private IXTodoContext db = new XTodoContext();

        public CategoriesController() { }

        public CategoriesController(IXTodoContext context) {
            db = context;
        }

        // GET: api/Categories
        public IQueryable<Category> GetCategories() {
            return db.Categories.Include(c => c.Tasks);
        }

        // GET: api/Categories/5
        [ResponseType(typeof(Category))]
        public async Task<IHttpActionResult> GetCategory(int id) {
            Category category = await db.Categories.FindAsync(id);
            if (category == null) {
                return NotFound();
            }

            return Ok(category);
        }

        // PUT: api/Categories/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutCategory(int id, Category category) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            if (id != category.Id) {
                return BadRequest("Provided Id does not match category Id");
            }

            db.MarkAsModified(category);

            try {
                await db.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!CategoryExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Categories
        [ResponseType(typeof(Category))]
        public async Task<IHttpActionResult> PostCategory(Category category) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            db.Categories.Add(category);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = category.Id }, category);
        }

        // DELETE: api/Categories/5
        [ResponseType(typeof(Category))]
        public async Task<IHttpActionResult> DeleteCategory(int id) {
            Category category = await db.Categories.FindAsync(id);
            if (category == null) {
                return NotFound();
            }

            db.Categories.Remove(category);
            await db.SaveChangesAsync();

            return Ok(category);
        }

        protected override void Dispose(bool disposing) {
            if (disposing) {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CategoryExists(int id) {
            return db.Categories.Count(e => e.Id == id) > 0;
        }
    }
}
