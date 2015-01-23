import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  normalizePayload: function (payload) {
    if (payload instanceof Array) {
      var tasks = [];
      payload.forEach(function (c) {
        tasks = tasks.concat(c.tasks);
        c.tasks = c.tasks.map(function (t) { return t.id; });
      });

      return { categories: payload, tasks: tasks };
    }
    return { category: payload };
  }

});
