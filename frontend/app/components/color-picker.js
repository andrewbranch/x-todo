import Ember from 'ember';
var colors = [
  '#b76868',
  '#b76891',
  '#b668b7',
  '#8e68b7',
  '#6869b7',
  '#6891b7',
  '#68b7b6',
  '#68b78e',
  '#68b78e',
  '#69b768',
  '#b7b668',
  '#b78e68'
].map(function (c) {
  return {
    color: c,
    colorStyle: 'color: ' + c + ';',
    backgroundColorStyle: 'background-color: ' + c + ';'
  };
});

export default Ember.Component.extend({

  classNames: ['color-picker'],

  didInsertElement: function () {
    this.$('.ui.dropdown').dropdown();
  },

  colorData: function () {
    return colors.map(function (c) {
      return {
        selected: c === this.get('selectedColor'),
        data: c
      };
    }.bind(this));
  }.property('selectedColor'),

  selectedColorData: function () {
    return colors.find(function (c) {
      return c.color === this.get('selectedColor');
    }.bind(this));
  }.property('selectedColor'),

  actions: {
    pickColor: function (color) {
      this.set('selectedColor', color.color);
    }
  }

});
