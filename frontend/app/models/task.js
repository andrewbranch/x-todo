import DS from 'ember-data';

export default DS.Model.extend({

  title: DS.attr('string'),
  dueDate: DS.attr('moment'),
  completed: DS.attr('boolean'),
  index: DS.attr('number'),
  category: DS.belongsTo('category')

});
