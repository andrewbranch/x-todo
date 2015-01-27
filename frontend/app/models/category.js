import DS from 'ember-data';
var staticEnvironment = window.XTodo.environment === 'static';

var Category = DS.Model.extend({

  name: DS.attr('string'),
  color: DS.attr('string'),
  disclosed: DS.attr('boolean'),
  index: DS.attr('number'),
  tasks: DS.hasMany('task', {
    async: staticEnvironment
  })

});

if (staticEnvironment) {
  Category.reopenClass({
    FIXTURES: [{
      "id": 1,
      "name": "Work",
      "color": "#b768b7",
      "disclosed": false,
      "index": 0,
      "tasks": [1]
    }, {
      "id": 2,
      "name": "Adventure",
      "color": "#68b7b7",
      "disclosed": false,
      "index": 1,
      "tasks": [2, 3]
    }, {
      "id": 3,
      "name": "Groceries",
      "color": "#68b768",
      "disclosed": false,
      "index": 2,
      "tasks": [4, 5, 6, 7]
    }]
  });
}

export default Category;
