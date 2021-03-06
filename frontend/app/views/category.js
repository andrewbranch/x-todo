/* global $ */

import Ember from 'ember';

export default Ember.View.extend({

  classNameBindings: ['editing'],
  attributeBindings: ['style'],

  didInsertElement: function () {
    this.$('ul.category').sortable({
      axis: 'y',
      connectWith: '.category',
      update: this.get('didReorderTasks').bind(this),
      receive: this.get('didMoveTaskIn').bind(this)
    });
  },

  didReorderTasks: function () {
    var indexHash = { };
    this.$('ul.category > li').each(function (i, item) {
      indexHash[$(item).data('id').toString()] = i;
    });

    this.get('controller').send('updateTaskIndexes', indexHash);
    this.rerender();
  },

  didMoveTaskIn: function (event, ui) {
    this.get('controller').send('updateTaskCategory', ui.item.data('id'));
  }

});
