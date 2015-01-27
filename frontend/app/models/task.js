import DS from 'ember-data';
var staticEnvironment = window.XTodo.environment === 'static';

var Task = DS.Model.extend({

  title: DS.attr('string'),
  dueDate: DS.attr('moment'),
  completed: DS.attr('boolean'),
  index: DS.attr('number'),
  category: DS.belongsTo('category')

});

if (staticEnvironment) {
  Task.reopenClass({
    FIXTURES: [{
      "id": 1,
      "title": "Get a job",
      "dueDate": null,
      "completed": false,
      "index": 0,
      "categoryId": 1
    }, {
      "id": 2,
      "title": "Buy a kayak and go",
      "dueDate": null,
      "completed": false,
      "index": 0,
      "categoryId": 2
    }, {
      "id": 3,
      "title": "Visit Yosemite",
      "dueDate": null,
      "completed": false,
      "index": 1,
      "categoryId": 2
    }, {
      "id": 4,
      "title": "Pink Lady apples",
      "dueDate": null,
      "completed": false,
      "index": 0,
      "categoryId": 3
    }, {
      "id": 5,
      "title": "Fresh mozzarella",
      "dueDate": null,
      "completed": false,
      "index": 1,
      "categoryId": 3
    }, {
      "id": 6,
      "title": "Roma tomatoes",
      "dueDate": null,
      "completed": false,
      "index": 2,
      "categoryId": 3
    }, {
      "id": 7,
      "title": "Olive oil",
      "dueDate": null,
      "completed": false,
      "index": 3,
      "categoryId": 3
    }]
  });
}

export default Task;
