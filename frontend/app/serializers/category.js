import DS from 'ember-data';

export default DS.RESTSerializer.extend({

  normalizePayload: function (payload) {
    if (payload instanceof Array) {
      var tasks = [];
      payload.forEach(function (c) {
        tasks = tasks.concat(c.tasks);
        c.tasks = c.tasks.map(function (t) { return t.id; });
      });

      console.log({ categories: payload, tasks: tasks });
      return { categories: payload, tasks: tasks };
    }
    return { category: payload };
  }

});
