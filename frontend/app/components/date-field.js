/* global Pikaday, moment */

import Ember from 'ember';

export default Ember.TextField.extend({
  picker: null,

  updateValue: function () {
    var date = this.get('date'),
        picker = this.get('picker');
    if (picker && date.isValid() && !this.$().is(':focus')) {
      this.set('value', date.format('L'));
      picker.setDate(date.format('L'));
    }
  }.observes('date'),

  updateDate: function () {
    var date = moment(new Date(this.get('value')));
    if (date.isValid()) {
      this.set('date', date);
    } else {
      this.set('date', null);
    }
  }.observes('value'),

  didInsertElement: function () {
    var picker = new Pikaday({
      field: this.$()[0],
      format: 'MM/DD/YYYY'
    });
    this.set('picker', picker);
    this.updateValue();
    picker.show();
  },

  willDestroyElement: function (){
    var picker = this.get('picker');
    if (picker) {
      picker.destroy();
    }
    this.set('picker', null);
  }
});
