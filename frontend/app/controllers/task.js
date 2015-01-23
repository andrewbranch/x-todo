import Ember from 'ember';
import EditableObjectController from './editable-object';

export default EditableObjectController.extend({

  isValid: function () {
    return (this.get('title') || '').trim().length > 0;
  }.property('title'),

  saveAutomatically: function () {
    this._super();
  }.observes('title', 'completed'),

  actions: {
    delete: function () {
      this.get('model').destroyRecord();
    }
  }

});
