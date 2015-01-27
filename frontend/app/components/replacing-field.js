import Ember from 'ember';
var reselectTimer,
    LEFT_ARROW = 37,
    RIGHT_ARROW = 39,
    RETURN = 13,
    ESCAPE = 27,
    SPACE = 32;

export default Ember.TextField.extend({

  classNames: ['replacing-field'],
  interval: 1000,
  validationPattern: '.*',


  willReplace: function () {
    return Math.abs(this.element.selectionEnd - this.element.selectionStart) === this.get('value.length');
  },

  selectText: function () {
    // There's a chance the element has already been removed
    if (this.element) {
      this.element.setSelectionRange(0, this.element.value.length);
    }
  }.on('focusIn', 'click'),

  cancelReselection: function () {
    Ember.run.cancel(reselectTimer);
  }.on('focusOut'),

  keyDown: function (event) {
    if (event.which === LEFT_ARROW || event.which === RIGHT_ARROW) {
      return false;
    }
    if (event.which === RETURN || event.which === ESCAPE || (event.which <= 46 && event.which !== SPACE)) {
      return true;
    }

    var key = String.fromCharCode(event.which),
        optionsString = this.get('autocompleteOptions'),
        options = optionsString ? optionsString.split(',') : [],
        advanceCharactersString = this.get('advanceCharacters'),
        advanceCharacters = advanceCharactersString ? advanceCharactersString.split(',') : [],
        advanceShiftCharacters = advanceCharacters.map(function (c) {
          return !!~c.indexOf('SHIFT') ? c.replace('SHIFT', '') : undefined;
        });

    if (advanceCharacters.contains(key) || (event.shiftKey && advanceShiftCharacters.contains(key))) {
      this.sendAction('advance');
      return false;
    }

    if (options.length && this.willReplace()) {
      var option = options.find(function (o) {
        return o.toLowerCase().indexOf(key.toLowerCase()) === 0;
      });
      if (option) {
        this.set('value', option);
        Ember.run.scheduleOnce('afterRender', this, 'selectText');
      }
      return false;
    }


    if (new RegExp(this.get('validationPattern')).test(this.willReplace() ? key : this.get('value') + key)) {
      return true;
    }

    return false;
  },

  reselect: function () {
    if (this.$().is(':focus')) {
      reselectTimer = Ember.run.debounce(this, 'selectText', this.get('interval'));
    }
  }.observes('value')

});
