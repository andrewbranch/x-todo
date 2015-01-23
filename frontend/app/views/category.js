import Ember from 'ember';

export default Ember.View.extend({

  didInsertElement: function () {
    this.$('ul').sortable({
      axis: 'y',
      connectWith: '.category',
      update: this.get('didReorderTasks').bind(this)
    });
  },

  didReorderTasks: function (event, ui) {
    var indexHash = { };
    this.$('li').each(function (i, item) {
      indexHash[$(item).data('id').toString()] = i;
    });

    this.get('controller').send('updateTaskIndexes', indexHash);
    this.rerender();
  }

});
