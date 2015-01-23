import Ember from 'ember';

export default Ember.ArrayController.extend(Ember.SortableMixin, {

  sortProperties: ['index'],

  actions: {
    addCategory: function () {
      // Create on client side, persist after user names it
      this.store.createRecord('category', {
        index: this.get('length') // Add to the end
      });
    }
  }

});
