/* global moment */

import Ember from 'ember';
var doneTimer,
    RETURN = 13,
    ESCAPE = 27;

export default Ember.Component.extend({

  classNames: ['date-time-field', 'ui', 'input'],

  hour: function () {
    return this.get('date').hour();
  }.property('date'),

  minute: function () {
    return this.get('date').format('mm');
  }.property('date'),

  meridiem: function () {
    return this.get('date').format('A');
  }.property('date'),

  formattedHour: function () {
    return this.get('date').format('h');
  }.property('date'),

  updateTime: function () {
    var h = this.get('formattedHour') % 12 + (this.get('meridiem') === 'AM' ? 0 : 12);
    this.set('date', this.get('date').hour(h).minute(this.get('minute')));
  }.observes('formattedHour', 'minute', 'meridiem'),

  focusOut: function () {
    doneTimer = Ember.run.later(this, function () {
      this.sendAction('done');
    }, 100);
  },

  focusIn: function () {
    Ember.run.cancel(doneTimer);
  },

  keyUp: function (event) {
    if ([RETURN, ESCAPE].contains(event.which)) {
      this.sendAction('done');
    }
  }

});
