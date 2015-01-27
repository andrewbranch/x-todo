/* global moment */

import Ember from 'ember';

export default Ember.TextField.extend({

  didInsertElement: function () {
    this.$().focus();
  },

  textToDateTransform: function (key, value) {
    var date;
    if (arguments.length === 2) {
      if (value && /\d{4}-\d{2}-\d{2}/.test(value)) {
        var parts = value.split('-');
        date = new Date();
        date.setYear(parts[0]);
        date.setMonth(parts[1] - 1);
        date.setDate(parts[2]);

        this.set('date',  moment(date));
      } else {
        this.set('date', null);
      }
    } else if (!value && this.get('date')) {
      return this.get('date').format('YYYY-MM-DD');
    } else {
      return value;
    }
  }.property(),

  placeholder: "yyyy-mm-dd",
  valueBinding: "textToDateTransform"
});
