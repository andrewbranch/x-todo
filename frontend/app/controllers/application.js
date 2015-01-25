import Ember from 'ember';

export default Ember.Controller.extend({

  countTime: function () {
    this.set('currentTime', new Date());
    Ember.run.later(this, 'countTime', 1000);
  }.on('init')

});
