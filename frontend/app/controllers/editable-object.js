import Ember from 'ember';

export default Ember.ObjectController.extend({

  editing: false,
  saving: false,

  // Go straight to editing mode for new records
  init: function () {
    if (this.get('currentState.stateName') === 'root.loaded.created.uncommitted') {
      this.set('editing', true);
    }
  },

  save: function () {
    if (!this.get('saving') && this.get('isDirty')) {
      var self = this;
      this.set('saving', true);
      this.get('model').save().then(function () {
        self.set('saving', false);
      });
    }
  },

  // Automatically save changes after inactivity of 1 second
  saveAutomatically: function () {
    if (this.get('isDirty') && this.get('isValid')) {
      console.log('debounce called');
      Ember.run.debounce(this, 'save', 1000);
    }
  }.observes('isDirty', 'isValid').on('init')

});
