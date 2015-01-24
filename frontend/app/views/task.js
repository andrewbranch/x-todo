import Ember from 'ember';

export default Ember.View.extend({

  templateName: 'task',
  tagName: 'li',
  attributeBindings: ['data-id'],

  didInsertElement: function () {
    this.$('.ui.checkbox').checkbox();
  }

});
