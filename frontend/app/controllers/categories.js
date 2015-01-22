import Ember from 'ember';

export default Ember.ArrayController.extend({

  itemController: 'category',

  actions: {
    addCategory: function () {
      var category = this.store.createRecord('category', {
        name: 'New Category',
        index: this.get('length')
      });
      category.save();
    }
  }

});
