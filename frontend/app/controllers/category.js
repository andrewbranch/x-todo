import Ember from 'ember';
import EditableObjectController from './editable-object';

export default EditableObjectController.extend({

  isValid: function () {
    return (this.get('name') || '').trim().length > 0;
  }.property('name'),

  sortedTasks: function () {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['index'],
      content: this.get('tasks')
    });
  }.property('tasks'),

  actions: {

    addTask: function () {
      this.store.createRecord('task', {
        index: this.get('tasks').get('length'),
        category: this.get('model')
      });
    },

    delete: function () {
      if (!this.get('tasks').get('length') || confirm('All tasks in this category will be deleted.')) {
        this.get('model').destroyRecord();
      }
    },

    updateTaskIndexes: function (indexHash) {
      this.beginPropertyChanges();
      for (var taskId in indexHash) {
        this.store.find('task', parseInt(taskId)).then(function (t) {
          if (t.get('index') !== indexHash[this]) {
            t.set('index', indexHash[this]);
            t.save();
          }
        }.bind(taskId));
      }
      this.endPropertyChanges();
    }
  }

});
