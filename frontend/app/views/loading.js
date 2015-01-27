/* global $ */

import Ember from 'ember';

export default Ember.View.extend({

  didInsertElement: function () {
    $('#container').addClass('loading');
  },

  willDestroyElement: function () {
    $('#container').removeClass('loading');
  }

});
