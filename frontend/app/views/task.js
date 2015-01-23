/* global $ */

import Ember from 'ember';

export default Ember.View.extend({

  templateName: 'task',

  didInsertElement: function () {
    this.$('.ui.checkbox').checkbox();
  }

});
