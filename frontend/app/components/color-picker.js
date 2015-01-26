/* global tinycolor */

import Ember from 'ember';

var colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
      var color = tinycolor('#b76868').spin(-30 * i).toString();
      return {
        color: color,
        colorStyle: 'color: ' + color + ';',
        backgroundColorStyle: 'background-color: ' + color + ';'
      };
    });

export default Ember.Component.extend({

  classNames: ['color-picker'],

  didInsertElement: function () {
    this.$('.ui.dropdown').dropdown();
    if (!this.get('selectedColor')) {
      this.assignDefaultColor();
    }
  },

  assignDefaultColor: function () {
    var options = colors.filter(function (c) {
      return !(this.get('defaultColorExcludes') || []).contains(c.color);
    }.bind(this));
    if (!options.length) {
      options = colors;
    }
    this.set('selectedColor', options[Math.floor(Math.random() * (options.length - 1))].color);
  },

  colorData: function () {
    return colors.map(function (c) {
      return {
        selected: c.color === this.get('selectedColor'),
        data: c
      };
    }.bind(this));
  }.property('selectedColor'),

  selectedColorData: function () {
    return colors.find(function (c) {
      return c.color === this.get('selectedColor');
    }.bind(this));
  }.property('selectedColor'),

  updateController: function () {
    this.sendAction('updatedColorData', this.get('selectedColorData'));
  }.observes('selectedColorData').on('init'),

  actions: {
    pickColor: function (color) {
      this.set('selectedColor', color.color);
    }
  }

});
