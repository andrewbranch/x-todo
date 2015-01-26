import Ember from 'ember';

export default Ember.ArrayController.extend(Ember.SortableMixin, {

  sortProperties: ['index'],

  anyCompleted: function () {
    return this.get('completedTasks.length');
  }.property('completedTasks.length'),

  completedTasks: function () {
    return [].concat.apply([], this.get('model').map(function (c) {
      return c.get('tasks').filter(function (t) {
        return t.get('completed');
      });
    }));
  }.property(),

  usedColors: function () {
    return this.get('model').map(function (c) {
      return c.get('color');
    });
  }.property('@each.color'),

  updateIndexes: function () {
    var categories = this.get('arrangedContent');
    this.beginPropertyChanges();
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].get('index') !== i) {
        categories[i].set('index', i);
        categories[i].save();
      }
    }
    this.endPropertyChanges();
  }.observes('[]'),

  actions: {

    addCategory: function () {
      // Create on client side, persist after user names it
      this.store.createRecord('category', {
        index: this.get('length') // Add to the end
      });
    },

    removeCompletedTasks: function () {
      this.get('completedTasks').forEach(function (t) {
        if (!~t.get('currentState.stateName').indexOf('inFlight')) {
          t.destroyRecord();
        }
      });
    }
  }

});
