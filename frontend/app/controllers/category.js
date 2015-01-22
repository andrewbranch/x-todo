import Ember from 'ember';

export default Ember.ObjectController.extend({

  actions: {
    addTask: function () {
      this.get('tasks').addObject(this.store.createRecord('task'));
    }
  }

});
