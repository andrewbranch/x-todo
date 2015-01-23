import Ember from 'ember';
import EditableObjectController from './editable-object';

export default EditableObjectController.extend({

  isValid: function () {
    return (this.get('name') || '').trim().length > 0;
  }.property('name'),

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
    }
  }

});
