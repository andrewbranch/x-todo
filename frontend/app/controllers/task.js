/* global moment */

import EditableObjectController from './editable-object';

export default EditableObjectController.extend({

  needs: ['application'],

  overdue: function () {
    return !this.get('completed') && (this.get('dueDate') || Infinity) < this.get('controllers.application.currentTime');
  }.property('dueDate', 'completed', 'controllers.application.currentTime'),

  timeOverdue: function () {
    var dueDate = this.get('dueDate');
    if (dueDate) {
      return dueDate.fromNow().replace(' ago', '');
    }
  }.property('dueDate', 'controllers.application.currentTime'),

  isValid: function () {
    return (this.get('title') || '').trim().length > 0;
  }.property('title'),

  saveAutomatically: function () {
    this._super();
  }.observes('title', 'completed'),

  formattedDueDate: function () {
    var dueDate = this.get('dueDate');
    if (dueDate) {
      return dueDate.calendar();
    }
    return null;
  }.property('dueDate'),

  deleteEmptyTasks: function () {
    var title = this.get('title');
    if (!this.get('editing') && (!title || !title.length)) {
      this.send('delete');
    }
  }.observes('editing'),

  actions: {
    addDueDate: function () {
      this.set('dueDate', moment().minute(0).add(1, 'days'));
      this.set('editingDueDate', true);
    },

    removeDueDate: function () {
      this.set('dueDate', null);
    },

    editDueDate: function () {
      this.set('editingDueDate', true);
    },

    endEditingDueDate: function () {
      this.set('editingDueDate', false);
      this.save();
    },

    delete: function () {
      this.get('model').destroyRecord();
    }
  }

});
