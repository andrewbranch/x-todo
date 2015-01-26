import Ember from 'ember';

export default Ember.View.extend({

  templateName: 'task',
  tagName: 'li',
  attributeBindings: ['data-id'],
  classNames: ['task'],
  classNameBindings: ['completed', 'overdue', 'editing'],

  didInsertElement: function () {
    this.$('.ui.checkbox').checkbox();
  }

});
