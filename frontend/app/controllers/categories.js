import Ember from 'ember';

export default Ember.ArrayController.extend({

  actions: {
    addCategory: function () {
      // Create on client side, persist after user names it
      var category = this.store.createRecord('category', {
        index: this.get('length') // Add to the end
      });
    }
  }

});
