import Ember from 'ember';

var RETURN = 13,
    ESCAPE = 27;

export default Ember.Component.extend({

  classNames: ['click-to-edit-text'],
  attributeBindings: ['style'],

  didInsertElement: function () {
    var self = this;

    this.$('input').on('blur', function () {
      self.sendAction('blur');
      self.set('editing', false);
    }).on('keyup', function (event) {

      if (event.which === RETURN) {
        self.sendAction('return');
        self.set('editing', false);
        return;
      }

      if (event.which === ESCAPE) {
        self.set('editing', false);
      }
    });
  },

  click: function () {
    if (!this.get('editing')) {
      this.set('editing', true);
    }
  },

  focusInput: function () {
    if (this.get('editing')) {
      Ember.run.scheduleOnce('afterRender', this, function () {
        this.$('input').focus();
      });
    }
  }.observes('editing').on('didInsertElement')

});
