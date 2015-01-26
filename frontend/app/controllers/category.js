import Ember from 'ember';
import EditableObjectController from './editable-object';

export default EditableObjectController.extend({

  needs: ['categories'],

  isValid: function () {
    return (this.get('name') || '').trim().length > 0;
  }.property('name'),

  sortedTasks: function () {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['index'],
      content: this.get('tasks')
    });
  }.property('tasks'),

  notifyCompletedTasks: function () {
    this.get('controllers.categories').notifyPropertyChange('completedTasks');
  }.observes('tasks.@each.completed'),

  actions: {

    addTask: function () {
      this.store.createRecord('task', {
        index: this.get('tasks').get('length'),
        category: this.get('model')
      });
    },

    saveAutomatically: function () {
      this._super();
    }.observes('name', 'color'),

    delete: function () {
      if (!this.get('tasks').get('length') || confirm('All tasks in this category will be deleted.')) {
        this.get('model').destroyRecord();
      }
    },

    updateColor: function (colorData) {
      this.set('colorData', colorData);
    },

    updateTaskIndexes: function (indexHash) {
      var updateTask = function (task) {
        if (task.get('index') !== indexHash[this]) {
          task.set('index', indexHash[this]);
          task.save();
        }
      };

      this.beginPropertyChanges();
      for (var taskId in indexHash) {
        this.store.find('task', parseInt(taskId)).then(updateTask.bind(taskId));
      }
      this.endPropertyChanges();
    },

    updateTaskCategory: function (taskId) {
      this.store.find('task', taskId).then(function (t) {
        t.set('category', this.get('model'));
        t.save();
      }.bind(this));
    }
  }

});
