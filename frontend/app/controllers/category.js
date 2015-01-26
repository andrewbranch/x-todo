import Ember from 'ember';
import EditableObjectController from './editable-object';
var previousName;

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

  setPreviousName: function () {
    if (this.get('editing')) {
      previousName = this.get('name')
    }
  }.observes('editing'),

  undoDeletingNameOrDeleteEmpty: function () {
    if (!this.get('editing') && !this.get('name.length')) {
      if (this.get('tasks.length')) {
        this.set('name', previousName);
      } else {
        this.send('delete');
      }
    }
  }.observes('editing'),

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
