import Ember from 'ember';

export default Ember.ObjectController.extend({

  editing: false,

  init: function () {
    if (this.get('currentState.stateName') === 'root.loaded.created.uncommitted') {
      this.set('editing', true);
    }
  },

  actions: {
    delete: function () {
      this.get('model').deleteRecord();
    }
  }

});
